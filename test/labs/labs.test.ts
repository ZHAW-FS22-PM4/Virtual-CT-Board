import { assemble } from 'assembler'

const fs = require('fs')
const files = fs.readdirSync('test/labs/lab-files', { encoding: 'utf8' })

test.each([files])('assemble file : %s', (fileName) => {
  const fileContent = fs.readFileSync(`test/labs/lab-files/${fileName}`, {
    encoding: 'utf8',
    flag: 'r'
  })
  expect(() => assemble(fileContent)).not.toThrow()
})
