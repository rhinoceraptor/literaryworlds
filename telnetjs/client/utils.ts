
export const keyCodeIs = (keyCode: number) => (e: KeyboardEvent) => e.keyCode === keyCode

export const isCtrlL = (e: KeyboardEvent) => e.ctrlKey && keyCodeIs(76)(e)
export const isUpArrow = keyCodeIs(38)
export const isDownArrow = keyCodeIs(40)
export const isEnter = keyCodeIs(13)

// Match the form <http://domain.tld/path>.
export const urlRegex = /<https?:\/\/(.*)>\./

export const containsUrl = (str: string): boolean => urlRegex.test(str)
export const extractUrl = (str: string): string =>
  containsUrl(str) ?
  ((urlRegex.exec(str) || [])[1] || '') :
  ''
export const removeUrl = (str: string): string => str.replace(urlRegex, '')

