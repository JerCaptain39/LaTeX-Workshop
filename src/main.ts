'use strict'

import * as vscode from 'vscode'

import {Logger} from './logger'
import {Commander} from './commander'
import {Manager} from './manager'
import {Builder} from './builder'
import {Viewer} from './viewer'
import {Server} from './server'
import {Locator} from './locator'
import {Parser} from './parser'
import {Completer} from './completer'

export async function activate(context: vscode.ExtensionContext) {
    let extension = new Extension()
    global['latex'] = extension
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('LaTeX', extension.completer, '\\', '{', ','));

    vscode.commands.registerCommand('latex-workshop.build', () => extension.commander.build())
    vscode.commands.registerCommand('latex-workshop.view', () => extension.commander.view())
    vscode.commands.registerCommand('latex-workshop.synctex', () => extension.commander.synctex())
}

export class Extension {
    logger: Logger
    commander: Commander
    manager: Manager
    builder: Builder
    viewer: Viewer
    server: Server
    locator: Locator
    parser: Parser
    completer: Completer

    constructor() {
        this.logger = new Logger(this)
        this.commander = new Commander(this)
        this.manager = new Manager(this)
        this.builder = new Builder(this)
        this.viewer = new Viewer(this)
        this.server = new Server(this)
        this.locator = new Locator(this)
        this.parser = new Parser(this)
        this.completer = new Completer(this)
        this.logger.addLogMessage(`LaTeX Workshop initialized.`)
    }
}