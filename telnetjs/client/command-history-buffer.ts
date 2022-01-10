
export class CommandHistoryBuffer {
  history: Array<string>
  historyIndex: number

  constructor() {
    this.history = []
    this.historyIndex = 0
  }

  getCurrentValue() {
    return this.history[this.historyIndex]
  }

  reverseHistory(): string {
    return this.historyIndex ? this.history[--this.historyIndex] : ''
  }

  forwardHistory(): string {
    if (this.historyIndex < this.history.length) {
      return this.history[++this.historyIndex]
    } else {
      return ''
    }
  }

  overwriteHistory(): void {
    this.history.slice(this.historyIndex)
  }
}

