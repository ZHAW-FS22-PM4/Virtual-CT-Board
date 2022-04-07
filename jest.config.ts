import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  verbose: true,
  moduleDirectories: ['node_modules', 'src'],
  collectCoverageFrom: ['./src/**', '!./src/components/**']
}

export default config
