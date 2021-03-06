const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { defaults: tsjPreset } = require('ts-jest/presets');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
	preset: 'ts-jest',
	bail: 1,
	testTimeout: 60 * 1000,
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: './public/unit-test/coverage',
	coveragePathIgnorePatterns: [
		'/node_modules/'
	],
	coverageProvider: 'v8',
	moduleFileExtensions: [
		'js',
		'jsx',
		'ts',
		'tsx'
	],
	testEnvironment: 'node',
	transform: {
		...tsjPreset.transform,
	},
	testMatch: [
		"**/__tests__/**/*.[jt]s?(x)",
		"**/?(*.)+(spec|test).[jt]s?(x)",
		"!**/__helpers__/**"
	],
	testResultsProcessor: 'jest-sonar-reporter',
	reporters: [
		'default',
		[
			'./node_modules/jest-html-reporters',
			{
				pageTitle: 'Test report',
				publicPath: './public/unit-test',
				filename: 'index.html',
				expand: false,
			}
		]
	],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/packages' }),
};

