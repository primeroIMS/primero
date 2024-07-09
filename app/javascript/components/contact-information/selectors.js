// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import { fromJS } from "immutable";

import { NAMESPACE } from "./constants";

export const selectSupportData = state => state.getIn(["records", NAMESPACE, "data"], fromJS({}));
