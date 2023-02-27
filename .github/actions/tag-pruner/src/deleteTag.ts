import { debug, error } from '@actions/core'
import { exec, ExecOptions } from '@actions/exec'
import { EOL } from 'os'

/**
 * Delete a given tag name from origin.
 *
 * @param {string} tag Tag to delete.
 * @returns {Promise<void>} A promise which resolves on completion.
 */
export async function deleteTag(tag: string): Promise<void> {
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
		await exec('git', ['push', '--delete', 'origin', `refs/tags/${tag}`], options)
	} catch (err) {
		error(`Failed to delete ${tag} from origin`)
		if (err instanceof Error) debug(err.message)
		debug(`git push stdout:  ${EOL}${stdout}`)
		debug(`git push stderr:  ${EOL}${stderr}`)
	}
}
