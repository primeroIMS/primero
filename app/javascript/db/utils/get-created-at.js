// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { isDate, parseISO } from "date-fns";

export default record => (isDate(record.created_at) ? record.created_at : parseISO(record.created_at));
