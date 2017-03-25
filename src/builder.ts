'use strict'

import * as vscode from 'vscode'
import * as path from 'path'
import * as cp from 'child_process'

import {Extension} from './main'

export class Builder {
    extension: Extension
    currentProcess: cp.ChildProcess

    constructor(extension: Extension) {
        this.extension = extension
    }

    build(rootFile: string) {
        this.extension.logger.addLogMessage(`Build root file ${rootFile}`)
        let toolchain = this.createToolchain(rootFile)
        this.extension.logger.addLogMessage(`Created toolchain ${toolchain}`)
        this.buildStep(rootFile, toolchain, 0)
    }

    buildStep(rootFile: string, toolchain: string[], index: number) {
        if (toolchain.length === index) {
            this.extension.logger.addLogMessage(`Toolchain of length ${toolchain.length} finished.`)
            this.buildFinished(rootFile)
            return
        }

        this.extension.logger.addLogMessage(`Toolchain step ${index + 1}: ${toolchain[index]}`)
        this.currentProcess = this.processWrapper(toolchain[index], {cwd: path.dirname(rootFile)}, (error, stdout, stderr) => {
            this.extension.parser.parse(stdout)
            if (!error) {
                this.buildStep(rootFile, toolchain, index + 1)
                return
            }
            this.extension.logger.addLogMessage(`Toolchain returns with error.`)
        })
    }

    buildFinished(rootFile: string) {
        this.extension.logger.addLogMessage(`Successfully built ${rootFile}`)
        this.extension.viewer.refreshExistingViewer(rootFile)
    }

    processWrapper(command: string, options: any, callback: (error: Error, stdout: string, stderr: string) => void) : cp.ChildProcess {
        options.maxBuffer = Infinity
        return cp.exec(command, options, callback)
    }

    createToolchain(rootFile: string) : string[] {
        return [
            `latexmk -synctex=1 -interaction=nonstopmode -file-line-error -pdf "${path.basename(rootFile, '.tex')}"`
        ]
    }
}