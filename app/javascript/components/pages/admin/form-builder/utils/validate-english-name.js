// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { invalidCharRegexp } from "../../../../../libs";

export default async value => !(value.match(invalidCharRegexp)?.length || value.match(/^(\s+)$/)?.length);
