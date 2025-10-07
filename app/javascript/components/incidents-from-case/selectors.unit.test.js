// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { PrimeroModuleRecord } from "../application/records";
import { MODULES } from "../../config";

import { getViolenceType } from "./selectors";
import { CP_VIOLENCE_TYPE, GBV_VIOLENCE_TYPE } from "./components/panel/constants";

const state = fromJS({
  user: {
    modules: ["test1"]
  },
  application: {
    modules: [
      PrimeroModuleRecord({ unique_id: "test1", options: { violation_type_field: "test1_violence_type_field_id" } })
    ]
  }
});

describe("<IncidentFromCase /> - Selectors", () => {
  describe("getViolenceType", () => {
    it("should return violence type field id from store", () => {
      const violenceType = getViolenceType(state, "test1");

      expect(violenceType).toEqual("test1_violence_type_field_id");
    });

    it("should return violence type field id from store", () => {
      const violenceType = getViolenceType(state, MODULES.CP);

      expect(violenceType).toEqual(CP_VIOLENCE_TYPE);
    });

    it("should return violence type field id from store", () => {
      const violenceType = getViolenceType(state, MODULES.GBV);

      expect(violenceType).toEqual(GBV_VIOLENCE_TYPE);
    });
  });
});
