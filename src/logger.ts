'use strict'

import * as vscode from 'vscode'

import {Extension} from './main'

export class Logger {
    extension: Extension
    logPanel: vscode.OutputChannel

    constructor(extension: Extension) {
        this.extension = extension
        this.logPanel = vscode.window.createOutputChannel('LaTeX Workshop')
        this.addLogMessage('Initializing LaTeX Workshop.')
    }

    addLogMessage(message: string) {
        this.logPanel.append(`[${new Date().toLocaleTimeString('en-US', {hour12: false})}] ${message}\n`)
    }
}