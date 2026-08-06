import { describe, expect, it } from 'vitest'
import { RULES_VERSION } from '../src/config/dimensions'
import { decodeResultParams, encodeResultParams } from '../src/core/resultCodec'
import type { UserSelection } from '../src/types'

const validSelection: UserSelection = {
  rulesVersion: RULES_VERSION,
  toolIds: ['midjourney', 'chatgpt', 'codex'],
  captainId: 'codex',
}

describe('result codec', () => {
  it('encodes a canonical, compact result query', () => {
    expect(encodeResultParams(validSelection)).toEqual({
      v: '1',
      t: 'chatgpt,codex,midjourney',
      c: 'codex',
    })
  })

  it('restores a valid result selection', () => {
    expect(decodeResultParams({ v: '1', t: 'chatgpt,codex,midjourney', c: 'codex' })).toEqual({
      rulesVersion: 1,
      toolIds: ['chatgpt', 'codex', 'midjourney'],
      captainId: 'codex',
    })
  })

  it.each([
    [{ t: 'chatgpt,codex,midjourney', c: 'codex' }, '结果链接缺少参数 v'],
    [{ v: ['1', '1'], t: 'chatgpt,codex,midjourney', c: 'codex' }, '结果参数 v 不能重复'],
    [{ v: 'abc', t: 'chatgpt,codex,midjourney', c: 'codex' }, '无效的规则版本：abc'],
    [{ v: '1', t: 'chatgpt,,codex', c: 'codex' }, '结果链接中包含空工具ID'],
    [{ v: '1', t: 'chatgpt,codex,missing', c: 'codex' }, '未知工具：missing'],
    [{ v: '1', t: 'chatgpt,codex,midjourney', c: 'claude' }, '本命工具必须来自已选工具'],
  ])('rejects malformed parameters with an explicit error', (params, message) => {
    expect(() => decodeResultParams(params)).toThrow(message)
  })
})
