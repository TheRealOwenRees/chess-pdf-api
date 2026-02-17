export const stripPreambleFromTex = (texString: string) => {
  return texString
    .replace(/\\documentclass(?:\[.*?\])?\{.*?\}/g, '')
    .replace(/\\usepackage(?:\[.*?\])?\{.*?\}/g, '')
    .replace(/\\geometry\{.*?\}/g, '')
    .replace(/\\setlength\{.*?\}.*?\{.*?\}/g, '') // setlength has two sets of braces
    .trim()
}
