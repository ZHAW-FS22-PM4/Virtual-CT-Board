import { styleTags, tags as t } from '@codemirror/highlight'
import { LanguageSupport, LRLanguage } from '@codemirror/language'
import { parser } from './assembly.grammar'

export const AssemblyLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      styleTags({
        Keyword: t.keyword,
        Label: t.tagName,
        CodeOrDataArea: t.variableName,
        VariableName: t.variableName,
        RegisterLiteral: t.variableName,
        IntegerLiteral: t.number,
        MachInstrIntegerLiteral: t.number,
        MachInstrSymbolicLiteral: t.variableName,
        comment: t.lineComment,
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
