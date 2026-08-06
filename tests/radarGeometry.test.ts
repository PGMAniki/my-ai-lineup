import { describe, expect, it } from 'vitest'
import { createRadarPoint, createRadarPolygon, toSvgPoints } from '../src/core/radarGeometry'

describe('radar geometry', () => {
  it('starts at the top and distributes six axes around the center', () => {
    expect(createRadarPoint(0, 6, 100, 160)).toEqual({ x: 160, y: 60 })
    const opposite = createRadarPoint(3, 6, 100, 160)
    expect(opposite.x).toBeCloseTo(160)
    expect(opposite.y).toBeCloseTo(260)
  })

  it('maps values to radii and clamps values to the valid range', () => {
    const points = createRadarPolygon([100, 50, 0, 120, -10, 75], 100, 100, 160)
    expect(points).toHaveLength(6)
    expect(points[0]).toEqual({ x: 160, y: 60 })
    expect(points[2]).toEqual({ x: 160, y: 160 })
    expect(points[3]!.y).toBeCloseTo(260)
    expect(points[4]).toEqual({ x: 160, y: 160 })
  })

  it('creates SVG point strings and rejects invalid geometry', () => {
    expect(toSvgPoints([{ x: 1, y: 2 }, { x: 3.456, y: 4.567 }])).toBe('1.00,2.00 3.46,4.57')
    expect(() => createRadarPolygon([10, 20], 100, 100, 160)).toThrow('雷达图至少需要三个维度')
    expect(() => createRadarPolygon([10, 20, 30], 0, 100, 160)).toThrow('雷达图最大值必须大于0')
  })
})
