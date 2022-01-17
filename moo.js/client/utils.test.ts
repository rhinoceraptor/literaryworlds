/**
 * @jest-environment jsdom
 */

import {
  keyCodeIs,
  isCtrlL,
  isUpArrow,
  isDownArrow,
  isEnter,
  containsUrl,
  extractUrl,
  removeUrl
} from './utils'

describe('client/utils', () => {
  let url: string
  let str: string
  let strTwo: string

  describe('keyCodeIs', () => {
    it('should return true for key codes that match', () => {
      const e = new KeyboardEvent('keydown', { code: 'KeyA' })
      expect(keyCodeIs('KeyA')(e)).toEqual(true)
    })

    it('should return false for key codes that do not match', () => {
      const e = new KeyboardEvent('keydown', { code: 'KeyA' })
      expect(keyCodeIs('KeyB')(e)).toEqual(false)
    })
  })

  describe('isCtrlL', () => {
    it('should return true for ctrl l keyboard events', () => {
      const e = new KeyboardEvent('keydown', { ctrlKey: true, code: 'KeyL' })
      expect(isCtrlL(e)).toEqual(true)
    })

    it('should return false for non-ctrl l keyboard events', () => {
      const e = new KeyboardEvent('keydown', { code: 'KeyL' })
      expect(isCtrlL(e)).toEqual(false)
    })
  })

  describe('isUpArrow', () => {
    it('should return true for arrow up keyboard events', () => {
      const e = new KeyboardEvent('keydown', { code: 'ArrowUp' })
      expect(isUpArrow(e)).toEqual(true)
    })

    it('should return false for non-arrow up keyboard events', () => {
      const e = new KeyboardEvent('keydown', { code: 'ArrowDown' })
      expect(isUpArrow(e)).toEqual(false)
    })
  })

  describe('isDownArrow', () => {
    it('should return true for arrow down keyboard events', () => {
      const e = new KeyboardEvent('keydown', { code: 'ArrowDown' })
      expect(isDownArrow(e)).toEqual(true)
    })

    it('should return false for non-arrow down keyboard events', () => {
      const e = new KeyboardEvent('keydown', { code: 'ArrowUp' })
      expect(isDownArrow(e)).toEqual(false)
    })
  })

  describe('isEnter', () => {
    it('should return true for enter keyboard events', () => {
      const e = new KeyboardEvent('keydown', { code: 'Enter' })
      expect(isEnter(e)).toEqual(true)
    })

    it('should return false for non-enter keyboard events', () => {
      const e = new KeyboardEvent('keydown', { code: 'ArrowUp' })
      expect(isEnter(e)).toEqual(false)
    })
  })

  beforeEach(() => {
    url = 'https://my-domain.tld/url'
    str = `lorem ipsum <${url}>. dolor sit amet, consectetur adipiscing elit`
    strTwo = 'lorem ipsum dolor sit amet, consectetur adipiscing elit'
  })

  describe('containsUrl', () => {
    it('should return true when the string contains a url in the enCore format', () => {
      expect(containsUrl(str)).toEqual(true)
    })

    it('should return false when the string does not contains a url in the enCore format', () => {
      expect(containsUrl(strTwo)).toEqual(false)
    })
  })

  describe('extractUrl', () => {
    it('should return the url given by the enCore format', () => {
      expect(extractUrl(str)).toEqual(url)
    })

    it('should return the empty string when there is no url in the enCore format', () => {
      expect(extractUrl(strTwo)).toEqual('')
    })
  })

  describe('removeUrl', () => {
    it('should remove the url from the string', () => {
      expect(removeUrl(str)).toEqual(strTwo)
    })

    it('should leave the string alone if no url', () => {
      expect(removeUrl(strTwo)).toEqual(strTwo)
    })
  })
})

