export const wrapText = (
  text: string,
  maxWidth: number,
  measure: (value: string) => number,
  maxLines: number,
): string[] => {
  if (maxLines < 1) return []

  const characters = [...text.trim()]
  const lines: string[] = []
  let currentLine = ''

  for (const character of characters) {
    const candidate = currentLine + character
    if (currentLine && measure(candidate) > maxWidth) {
      lines.push(currentLine)
      currentLine = character
      if (lines.length === maxLines) break
    } else {
      currentLine = candidate
    }
  }

  if (lines.length < maxLines && currentLine) lines.push(currentLine)

  const consumedLength = lines.join('').length
  if (consumedLength < characters.length && lines.length) {
    const lastIndex = lines.length - 1
    let truncated = lines[lastIndex] ?? ''
    while (truncated && measure(`${truncated}…`) > maxWidth) truncated = truncated.slice(0, -1)
    lines[lastIndex] = `${truncated}…`
  }

  return lines
}

