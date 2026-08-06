export interface Point {
  x: number
  y: number
}

export const createRadarPoint = (
  index: number,
  total: number,
  radius: number,
  center: number,
): Point => {
  const angle = -Math.PI / 2 + index * ((Math.PI * 2) / total)
  return {
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius,
  }
}

export const toSvgPoints = (points: readonly Point[]): string =>
  points.map(({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ')

export const createRadarPolygon = (
  values: readonly number[],
  maximumValue: number,
  maximumRadius: number,
  center: number,
): Point[] => {
  if (values.length < 3) throw new Error('雷达图至少需要三个维度')
  if (maximumValue <= 0) throw new Error('雷达图最大值必须大于0')

  return values.map((value, index) =>
    createRadarPoint(
      index,
      values.length,
      maximumRadius * (Math.min(maximumValue, Math.max(0, value)) / maximumValue),
      center,
    ),
  )
}

