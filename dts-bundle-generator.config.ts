// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('./package.json')

const getPackageName = () => {
    return 'sundry'
}

const config = {
    entries: [
        {
            filePath: './src/index.ts',
            outFile: `./dist/${getPackageName()}.d.ts`,
            noCheck: false,
            libraries: {
                importedLibraries: ['functional-component'],
            },
        },
    ],
}

module.exports = config
