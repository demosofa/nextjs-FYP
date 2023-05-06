const path = require('path')

const buildEslintCommand = (filenames) =>
	`next lint --no-cache --fix --file ${filenames
		.map((f) => path.relative(process.cwd(), f))
		.join(' --file ')}`

module.exports = {
	'*.{js,jsx,ts,tsx}': [
		buildEslintCommand,
		'prettier --config ./.prettierrc.json --write'
	],
	'**/*.{css,scss,md,html,json}': [
		'prettier --config ./.prettierrc.json --write'
	]
}
