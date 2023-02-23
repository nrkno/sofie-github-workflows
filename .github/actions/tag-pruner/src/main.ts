import { getInput, info, setFailed } from '@actions/core'
import { getTags, GitTag } from './getTags'
import { deleteTag } from './deleteTag'

async function run(): Promise<void> {
	/** Regex of tags to ignore. */
	const ignore = getInput('ignore').length > 0 ? new RegExp(getInput('ignore'), 'gi') : undefined
	/** Number of days tags must be older than to be considered for deletion. */
	const olderThanDays = parseInt(
		getInput('older-than', {
			required: true,
		})
	)
	/** Simulation mode. */
	const simulation = getInput('simulation').toUpperCase() === 'TRUE'

	if (simulation) {
		info('Running in simulation mode')
	}

	// Work out target date.
	const olderThanDate = new Date()
	olderThanDate.setMilliseconds(0)
	olderThanDate.setSeconds(0)
	olderThanDate.setMinutes(0)
	olderThanDate.setHours(0)
	olderThanDate.setDate(olderThanDate.getDate() - olderThanDays)

	// Get tags.
	let result: GitTag[] | undefined
	try {
		result = await getTags()
	} catch (err) {
		setFailed('Could not list Git Tags')
		return
	}
	// Quit if there are no tags.
	if (!result) {
		info('No Git Tags were found')
		return
	}

	// Delete tags from remote.
	info('Tags to delete:')
	for (const tag of result.filter((t) => t.date < olderThanDate.valueOf() && (ignore ? !t.name.match(ignore) : true))) {
		info(tag.name)
		// Skip deletion in simulation mode.
		if (!simulation) {
			await deleteTag(tag.name)
		}
	}
}

void run()
