import { parser } from './assembly.grammar'
import { LRLanguage, LanguageSupport } from '@codemirror/language'
import { styleTags, tags as t } from '@codemirror/highlight'

export const AssemblyLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      styleTags({
        'MOV MOVS ADD ADDS ADCS SUBS RSBS SBCS MULS CMP CMN ANDS BICS EORS MVNS ORRS TST ASRS':
          t.variableName,
        ImmEight: t.number,
        ImmFive: t.number,
        ImmThree: t.number,
        LowReg: t.variableName,
        HighReg: t.variableName,
        LineComment: t.lineComment,
        ',': t.separator
      })
    ]
  }),
  languageData: {
    commentTokens: { line: ';' }
  }
})

export function Assembly(): LanguageSupport {
  return new LanguageSupport(AssemblyLanguage)
}
