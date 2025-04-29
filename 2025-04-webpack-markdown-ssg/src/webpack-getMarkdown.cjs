const fs = require ('fs');
const path = require ('path');
const DOMPurify = require ('isomorphic-dompurify');
const { marked } = require ('marked');

function getMarkdown() {
  const file = path.resolve(__dirname, './test.md');

  const result =  DOMPurify.sanitize(marked.parse(fs.readFileSync(file, 'utf-8')));

  console.log(result);
  return result;
}

module.exports = getMarkdown;
