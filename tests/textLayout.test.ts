import { describe, expect, it } from 'vitest'
import { wrapText } from '../src/core/textLayout'

const fixedMeasure = (value: string): number => [...value].length * 10

describe('share text layout', () => {
  it('wraps text using the provided measurement function', () => {
    expect(wrapText('一二三四五六', 30, fixedMeasure, 3)).toEqual(['一二三', '四五六'])
  })

  it('truncates overflowing text with an ellipsis', () => {
    expect(wrapText('一二三四五六七八九', 30, fixedMeasure, 2)).toEqual(['一二三', '四五…'])
  })

  it('handles empty text and zero line budgets', () => {
    expect(wrapText('', 30, fixedMeasure, 2)).toEqual([])
    expect(wrapText('文字', 30, fixedMeasure, 0)).toEqual([])
  })
})
