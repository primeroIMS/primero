/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

import NAMESPACE from "../namespace";

import { IMPORT } from "./constants";

export const getImportErrors = state => state.getIn(["records", "admin", NAMESPACE, IMPORT, "errors"], fromJS([]));
