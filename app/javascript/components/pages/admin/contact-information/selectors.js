// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

export const selectContactInformation = state => state.getIn(["records", "support", "data"], fromJS({}));

export const selectSavingContactInformation = state => state.getIn(["records", "support", "loading"], false);
