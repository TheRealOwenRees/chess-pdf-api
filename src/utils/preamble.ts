export const stripPreambleFromTex = (texString: string) => {
  return texString
    .replace(/\\documentclass.*/, '')
    .replace(/\\usepackage.*/, '')
    .replace(/\\geometry.*/, '')
    .replace(/\\setlength.*/, '')
}
