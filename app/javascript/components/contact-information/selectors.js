/* eslint-disable import/prefer-default-export */

import { fromJS } from "immutable";

import { NAMESPACE } from "./constants";

export const selectSupportData = state => state.getIn(["records", NAMESPACE, "data"], fromJS({}));
