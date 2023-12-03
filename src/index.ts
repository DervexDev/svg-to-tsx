#!/usr/bin/env node

import { Command } from 'commander'
import { optimize } from 'svgo'
import { parse, Node } from 'svg-parser'
import * as path from 'path'
import * as fs from 'fs'
import chalk from 'chalk'

const program = new Command()

function log(message: string, error?: boolean) {
	if (!error) {
		console.log(chalk.bgGreen('INFO:') + ` ${message}`)
	} else {
		console.error(chalk.bgRed('ERR:') + ` ${message}`)
	}
}

function walk(node: Node, output: string) {
	if (node.type == 'element') {
		if (node.tagName == 'svg') {
			output += '\n\t\t<svg'

			if (node.properties?.viewBox) {
				output += ` viewBox='${node.properties.viewBox}'`
			}

			output += ' {...props}>'
		} else if (
			node.tagName != 'defs' &&
			node.tagName != 'style' &&
			node.tagName != 'g'
		) {
			output += '\n\t\t\t<' + node.tagName

			for (let property in node.properties) {
				if (property != 'class' && property != 'id' && property != 'style') {
					output += ` ${property}='${node.properties[property]}'`
				}
			}

			output += ' />'
		}

		for (let child of node.children) {
			if (typeof child != 'string') {
				output = walk(child, output)
			}
		}
	}

	return output
}

function convert(options: any) {
	let output = path.join(options.output, options.name + '.tsx')
	let count = 0
	let tsx = ''

	if (!fs.existsSync(options.input)) {
		log(`Input directory ${options.input} does not exist!`, true)
		return
	} else if (!fs.existsSync(options.output)) {
		log(`Output directory ${options.output} does not exist!`, true)
		return
	}

	fs.readdirSync(options.input).forEach((file) => {
		let svg = fs.readFileSync(path.join(options.input, file), 'utf8')
		let optimized = optimize(svg, {})
		let parsed = parse(optimized.data)

		let name = file.substring(0, file.length - 4)
		name = name.charAt(0).toUpperCase() + name.slice(1)

		tsx += `export function ${name}(props: any) {\n\treturn (`
		tsx += walk(parsed.children[0], '')
		tsx += '\n\t\t</svg>\n\t)\n}\n\n'

		count++
	})

	tsx = tsx.slice(0, -1)

	fs.writeFileSync(output, tsx, 'utf8')

	log(`Successfully converted ${count} SVGs to ${output} module.`)
}

program
	.name('svg-to-tsx')
	.description('Convert all your SVGs to one tsx module')
	.version('1.0.0')
	.requiredOption('-i, --input <path>', 'Input directory')
	.requiredOption('-o, --output <path>', 'Output directory')
	.option('-n, --name <string>', 'Name of the module', 'icons')
	.action(convert)

program.parse()
