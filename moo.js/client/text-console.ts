import { splashTextBanner, connectionLostBanner } from './strings'
import { CommandHistoryBuffer } from './command-history-buffer'
import {
  containsUrl,
  extractUrl,
  removeUrl,
  isCtrlL,
  isUpArrow,
  isDownArrow,
  isEnter
} from './utils'

export class TextConsole {
  consoleOutput: HTMLElement
  consoleInput: HTMLInputElement
  enCoreIFrame?: Element
  cmdHistoryBuffer: CommandHistoryBuffer
  commandHandler?: (str: string) => void

  constructor(consoleOutput: HTMLElement, consoleInput: HTMLInputElement, enCoreIFrame?: Element) {
    this.consoleOutput = consoleOutput
    this.consoleInput = consoleInput
    this.enCoreIFrame = enCoreIFrame
    this.cmdHistoryBuffer = new CommandHistoryBuffer()

    this.consoleInput.addEventListener('keydown', this.inputHandler.bind(this))
  }

  outputData(str: string): void {
    if (containsUrl(str)) {
      this.enCoreIFrame?.setAttribute('src', extractUrl(str))
      str = removeUrl(str)
    }

    this.writeToConsoleOutput(str)
  }

  onCommandEntered(fn: (str: string) => void): void {
    this.commandHandler = fn
  }

  informReady(): void {
    this.writeToConsoleOutput(splashTextBanner)
  }

  informConnectionLost(): void {
    this.writeToConsoleOutput(connectionLostBanner)
  }

  writeToConsoleOutput(str: string): void {
    this.consoleOutput.textContent += str
  }

  writeToConsoleInput(str: string): void {
    this.consoleInput.value = str
  }

  inputHandler(e: KeyboardEvent): void {
    switch (true) {
      case (isCtrlL(e)):
        e.preventDefault()
        this.clearConsoleOutput()
        break
      case (isUpArrow(e)):
        this.writeToConsoleInput(this.cmdHistoryBuffer.reverseHistory())
        break
      case (isDownArrow(e)):
        this.writeToConsoleInput(this.cmdHistoryBuffer.forwardHistory())
        break
      case (isEnter(e)):
        e.preventDefault()
        this.cmdHistoryBuffer.write(this.consoleInput.value)
        this.commandHandler && this.commandHandler(this.consoleInput.value)
        this.writeToConsoleInput('')
        break
    }
  }

  clearConsoleOutput(): void {
    const outputHeight: number = this.consoleOutput.offsetHeight
    const fontHeight: number = parseInt(window.getComputedStyle(this.consoleOutput).fontSize, 10)
    const numberOfLines: number = Math.ceil(outputHeight / fontHeight) + 1
    const newLines: string = Array(numberOfLines).join('\n')
    this.writeToConsoleOutput(newLines)
  }
}
