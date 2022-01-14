import { CommandHistoryBuffer } from './command-history-buffer'

describe('CommandHistoryBuffer', () => {
  let buffer: CommandHistoryBuffer

  beforeEach(() => {
    buffer = new CommandHistoryBuffer()
  })

  it('should return the current value', () => {
    buffer.write('1')
    buffer.write('2')
    expect(buffer.getCurrentValue()).toEqual('2')
  })

  it('should reverse through history', () => {
    buffer.write('1')
    buffer.write('2')
    buffer.write('3')
    buffer.write('4')
    expect(buffer.getCurrentValue()).toEqual('4')
    buffer.reverseHistory()
    expect(buffer.getCurrentValue()).toEqual('3')
    buffer.reverseHistory()
    expect(buffer.getCurrentValue()).toEqual('2')
    buffer.reverseHistory()
    expect(buffer.getCurrentValue()).toEqual('1')
    buffer.reverseHistory()
    expect(buffer.getCurrentValue()).toEqual('1')
  })

  it('should forward through history', () => {
    buffer.write('1')
    buffer.write('2')
    buffer.write('3')
    buffer.write('4')
    buffer.reverseHistory()
    buffer.reverseHistory()
    buffer.reverseHistory()
    buffer.reverseHistory()
    expect(buffer.getCurrentValue()).toEqual('1')
    buffer.forwardHistory()
    expect(buffer.getCurrentValue()).toEqual('2')
    buffer.forwardHistory()
    expect(buffer.getCurrentValue()).toEqual('3')
    buffer.forwardHistory()
    expect(buffer.getCurrentValue()).toEqual('4')
    buffer.forwardHistory()
    expect(buffer.getCurrentValue()).toEqual('4')
  })

  it('should store new commands in the buffer as LIFO', () => {
    buffer.write('1')
    buffer.write('2')
    buffer.write('3')
    buffer.write('4')
    expect(buffer.history).toEqual(['4', '3', '2', '1'])
  })
})

