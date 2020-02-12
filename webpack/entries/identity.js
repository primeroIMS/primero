const common = require("../config.common");
const config = require("../config");

const { ENTRIES, ENTRY_NAMES } = config;

const NAME = ENTRY_NAMES.IDENTITY;

const entry = common(NAME, ENTRIES[NAME]);

module.exports = entry;
