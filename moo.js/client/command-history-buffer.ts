export class CommandHistoryBuffer {
  history: Array<string>
  historyIndex: number

  constructor() {
    this.history = []
    this.historyIndex = -1
  }

  getCurrentValue() {
    return this.history[this.historyIndex] || ''
  }

  reverseHistory(): string {
    this.historyIndex += (this.historyIndex < this.history.length - 1) ? 1 : 0
    return this.getCurrentValue()
  }

  forwardHistory(): string {
    this.historyIndex -= (this.historyIndex >= 0) ? 1 : 0
    return this.getCurrentValue()
  }

  write(command: string): void {
    this.history = [command, ...this.history]
    this.historyIndex = -1
  }
}

