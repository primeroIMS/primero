// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */
import { MODULES } from "../../config";
import { selectModule } from "../application";

import { CP_VIOLENCE_TYPE, GBV_VIOLENCE_TYPE } from "./components/panel/constants";

function getViolenceType(state, moduleID) {
  const defaultModule = moduleID === MODULES.GBV ? GBV_VIOLENCE_TYPE : CP_VIOLENCE_TYPE;
  const selectedModule = selectModule(state, moduleID);

  return selectedModule.getIn(["options", "violation_type_field"], defaultModule);
}

export { getViolenceType };
