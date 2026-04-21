/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

import namespace from "./namespace";

export const getUnusedFieldsReport = state => state.getIn(["records", namespace, "data"], fromJS({}));
