import { stripPreambleFromTex } from '../src/utils/preamble'

describe('Strip Preamble', () => {
  test('strip documentclass', () => {
    expect(stripPreambleFromTex('\\documentclass{article}')).toBe('')
  })
  test('strip usepackage', () => {
    expect(stripPreambleFromTex('\\usepackage{somepackage}')).toBe('')
  })
  test('strip geometry', () => {
    expect(stripPreambleFromTex('\\geometry{left=1.25cm,right=1.25cm,top=1.5cm,bottom=1.5cm,columnsep=1.2cm}')).toBe('')
  })
  test('strip setlength', () => {
    expect(stripPreambleFromTex('\\setlength{\\parindent}{0pt}')).toBe('')
  })
  test('strip all relevant commands', () => {
    expect(
      stripPreambleFromTex(
        '\\documentclass{article}\\usepackage{somepackage}\\geometry{left=1.25cm,right=1.25cm,top=1.5cm,bottom=1.5cm,columnsep=1.2cm}\\setlength{\\parindent}{0pt}'
      )
    ).toBe('')
  })
  test('strip from full tex', () => {
    const tex =
      '\\documentclass{article}\\usepackage{somepackage}\\geometry{left=1.25cm,right=1.25cm,top=1.5cm,bottom=1.5cm,columnsep=1.2cm}\\setlength{\\parindent}{0pt}\\begin{document}\\section{Title}\\end{document}'
    expect(stripPreambleFromTex(tex)).toBe('\\begin{document}\\section{Title}\\end{document}')
  })
})
