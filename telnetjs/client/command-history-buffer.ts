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
    this.historyIndex += this.historyIndex < this.history.length - 1 ? 1 : 0
    return this.history[this.historyIndex]
  }

  forwardHistory(): string {
    this.historyIndex -= this.historyIndex ? 1 : 0
    return this.history[this.historyIndex]
  }

  write(command: string): void {
    this.history = [command, ...this.history]
    this.historyIndex = 0
  }
}

