import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  verbose: true,
  moduleDirectories: ['node_modules', 'src'],
  collectCoverageFrom: [
    './src/**',
    '!./src/components/**',
    '!./src/board/devices/device.ts' // device delegates everything to memory (this is already tested)
  ]
}

export default config
