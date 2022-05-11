import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  verbose: true,
  moduleDirectories: ['node_modules', 'src'],

  collectCoverage: true,
  collectCoverageFrom: [
    './src/assembler/**/*.ts',
    './src/board/**/*.ts',
    './src/instruction/**/*.ts',
    './src/types/**/*.ts'
  ],
  coverageThreshold: {
    global: {
      lines: 90
    },
    './src/assembler/**/*.ts': {
      lines: 90
    },
    './src/board/**/*.ts': {
      lines: 90
    },
    './src/instruction/**/*.ts': {
      lines: 90
    },
    './src/types/**/*.ts': {
      lines: 90
    }
  }
}

export default config
