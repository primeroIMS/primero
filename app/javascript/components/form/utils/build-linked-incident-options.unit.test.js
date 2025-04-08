// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import buildLinkedIncidentOptions from "./build-linked-incident-options";

describe("form/utils/build-linked-incident-options", () => {
  describe("buildLinkedIncidentOptions()", () => {
    it("should return the inicidents of a case as options", () => {
      const linkedIncidents = fromJS([
        { unique_id: "001-aaa", short_id: "aaa", incident_date: "2020-05-06", cp_incident_violence_type: "type1" },
        { unique_id: "001-bbb", short_id: "bbb", incident_date: "2020-05-07", cp_incident_violence_type: "type1" }
      ]);

      const violenceLookupValues = [{ id: "type1", display_text: "Type 1" }];

      const expected = [
        { id: "001-aaa", display_text: "2020-05-06 - Type 1 - aaa", disabled: false },
        { id: "001-bbb", display_text: "2020-05-07 - Type 1 - bbb", disabled: false }
      ];

      expect(
        buildLinkedIncidentOptions(linkedIncidents, violenceLookupValues, { localizeDate: value => value })
      ).toEqual(expected);
    });

    it("does not fail if the violence lookup value does not exist", () => {
      const linkedIncidents = fromJS([
        { unique_id: "001-aaa", short_id: "aaa", incident_date: "2020-05-06", cp_incident_violence_type: "type1" },
        { unique_id: "001-bbb", short_id: "bbb", incident_date: "2020-05-07", cp_incident_violence_type: "type1" }
      ]);

      const violenceLookupValues = [];

      const expected = [
        { id: "001-aaa", display_text: "2020-05-06 - aaa", disabled: false },
        { id: "001-bbb", display_text: "2020-05-07 - bbb", disabled: false }
      ];

      expect(
        buildLinkedIncidentOptions(linkedIncidents, violenceLookupValues, { localizeDate: value => value })
      ).toEqual(expected);
    });
  });
});
