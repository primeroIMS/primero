// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

// eslint-disable-next-line no-useless-concat
const defaultHtml = '<!doctype html><html><head><meta charset="utf-8">' + "</head><body></body></html>";

module.exports = require("jsdom-global/index")(defaultHtml, { url: "https://localhost/" });
