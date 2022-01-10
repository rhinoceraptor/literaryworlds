import { splashTextBanner, connectionLostBanner } from './strings'
import { CommandHistoryBuffer } from './command-history-buffer'
import {
  isCtrlL,
  isUpArrow,
  isDownArrow,
  isEnter
} from './utils'

export class TextConsole {
  consoleOutput: HTMLElement
  consoleInput: HTMLElement
  enCoreIFrame: HTMLElement
  cmdHistoryBuffer: CommandHistoryBuffer
  commandHandler?: Function

  constructor(consoleOutput: HTMLElement, consoleInput: HTMLElement, enCoreIFrame: HTMLElement) {
    this.consoleOutput = consoleOutput
    this.consoleInput = consoleInput
    this.enCoreIFrame = enCoreIFrame
    this.cmdHistoryBuffer = new CommandHistoryBuffer()

    this.consoleInput.addEventListener('keypress', this.inputHandler.bind(this))

    this.writeToConsoleOutput(splashTextBanner)
  }

  onCommandEntered(fn: Function): void {
    this.commandHandler = fn
  }

  onConnectionLost(): void {
    this.writeToConsoleOutput(connectionLostBanner)
  }

  writeToConsoleOutput(str: string): void {
    this.consoleOutput.textContent += str
  }

  writeToConsoleInput(str: string): void {
    this.consoleInput.textContent = str
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
        this.cmdHistoryBuffer.overwriteHistory()
        this.commandHandler && this.commandHandler(this.consoleInput.textContent)
        break
    }
  }

  clearConsoleOutput(): void {
  }
}
