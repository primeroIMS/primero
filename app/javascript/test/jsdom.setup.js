var defaultHtml = '<!doctype html><html><head><meta charset="utf-8">' +
  '</head><body></body></html>'

module.exports = require('jsdom-global/index')(defaultHtml, { url: 'https://localhost/' })