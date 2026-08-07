export const prefersLongPressImageSave = (
  userAgent: string,
  maxTouchPoints = 0,
): boolean => {
  const mobileUserAgent = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent)
  const desktopModeIPad = /Macintosh/i.test(userAgent) && maxTouchPoints > 1

  return mobileUserAgent || desktopModeIPad
}
