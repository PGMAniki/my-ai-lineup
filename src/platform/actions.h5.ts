export const copyText = async (text: string): Promise<void> => {
  await navigator.clipboard.writeText(text)
}
