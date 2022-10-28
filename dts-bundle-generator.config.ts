// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('./package.json')

const packageName = packageJson.name.replace(RegExp('.*/'), '')

const config = {
    entries: [
        {
            filePath: './src/index.ts',
            outFile: `./dist/${packageName}.d.ts`,
            noCheck: false,
        },
    ],
}

module.exports = config
