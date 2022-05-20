import { assemble } from 'assembler'

const fs = require('fs')
const basePath = 'test/labs/lab_files'
const files = fs.readdirSync(basePath, { encoding: 'utf8' })

test.each([...files])('assemble file : %s', (fileName) => {
  const fileContent = fs.readFileSync(`${basePath}/${fileName}`, {
    encoding: 'utf8',
    flag: 'r'
  })
  expect(() => assemble(fileContent)).not.toThrow()
})
