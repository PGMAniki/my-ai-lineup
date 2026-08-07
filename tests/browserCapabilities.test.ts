import { describe, expect, it } from 'vitest'
import { prefersLongPressImageSave } from '../src/core/browserCapabilities'

describe('prefersLongPressImageSave', () => {
  it('uses long-press saving on iPhone and Android', () => {
    expect(prefersLongPressImageSave('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0)')).toBe(true)
    expect(prefersLongPressImageSave('Mozilla/5.0 (Linux; Android 15; Pixel 9)')).toBe(true)
  })

  it('detects iPadOS when Safari requests a desktop site', () => {
    expect(prefersLongPressImageSave('Mozilla/5.0 (Macintosh; Intel Mac OS X)', 5)).toBe(true)
  })

  it('keeps the download button on desktop browsers', () => {
    expect(prefersLongPressImageSave('Mozilla/5.0 (Macintosh; Intel Mac OS X)', 0)).toBe(false)
    expect(prefersLongPressImageSave('Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 0)).toBe(false)
  })
})
