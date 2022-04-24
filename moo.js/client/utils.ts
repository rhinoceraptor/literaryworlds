
export const keyCodeIs = (code: string) => (e: KeyboardEvent) => e.code === code

export const isCtrlL = (e: KeyboardEvent) => e.ctrlKey && keyCodeIs('KeyL')(e)
export const isUpArrow = keyCodeIs('ArrowUp')
export const isDownArrow = keyCodeIs('ArrowDown')
export const isEnter = keyCodeIs('Enter')

// Match the form <http://domain.tld/path>.
export const urlRegex = /<(https?:\/\/.*)>\.\s*/

export const containsUrl = (str: string): boolean => urlRegex.test(str)
export const extractUrl = (str: string): string =>
  containsUrl(str) ?
  ((urlRegex.exec(str) || [])[1] || '') :
  ''
export const rewriteUrl = (str: string): string => str
  .replace('http://', 'https://')
  .replace(':7000', ':7443')

export const removeUrl = (str: string): string => str.replace(urlRegex, '')

