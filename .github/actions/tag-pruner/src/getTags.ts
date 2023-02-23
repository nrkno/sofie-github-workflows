import { debug, error } from '@actions/core'
import { exec, ExecOptions } from '@actions/exec'
import { EOL } from 'os'

/**
 * Get local Git tags.
 *
 * @returns {Promise<GitTag[]>} A promise which resolves with an array of GitTag objects or rejects on failure.
 */
export async function getTags(): Promise<GitTag[]> {
	const stdout: string[] = []
	const stderr: string[] = []

	const options: ExecOptions = {
		silent: true,
		listeners: {
			stdout: (data: Buffer) => {
				stdout.push(data.toString())
			},
			stderr: (data: Buffer) => {
				stderr.push(data.toString())
			},
		},
	}

	try {
		await exec('git', ['tag', '-l', '--sort=-creatordate', "--format='%(creatordate:short):%(refname:short)'"], options)
	} catch (err) {
		error(`Failed to list tags`)
		if (err instanceof Error) debug(err.message)
		debug(`git tag stderr: ${EOL}${stderr}`)
		throw err
	} finally {
		debug(`git tag stdout: ${EOL}${stdout}`)
	}

	return stdout
		.join()
		.split(EOL)
		.filter((l) => !!l.trim())
		.map((l) => {
			const d = l.trim().split(':')
			return {
				date: Date.parse(d[0]),
				name: d[1].replace(/'/g, ''), // Replace needed to fix a weird error where apostrophes appear!
			}
		})
}

export interface GitTag {
	date: number
	name: string
}
