// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import requireHacker from "require-hacker";

const extensions = ["css", "gif", "jpg", "svg", "png"];

extensions.forEach(type => {
  requireHacker.hook(type, path => {
    const typePath = type === 'css' ? "function() {}" : `"${path}"`;
    return `module.exports = ${typePath}`
  });
});
