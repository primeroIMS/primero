// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import first from "lodash/first";

import { SEPERATOR } from "../../constants";

export default fields => (first(fields).type === SEPERATOR ? first(fields) : {});
