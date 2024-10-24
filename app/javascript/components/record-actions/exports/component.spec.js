import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../test-utils";
import { RECORD_PATH } from "../../../config";
import { ACTIONS } from "../../permissions";
import { mapEntriesToRecord } from "../../../libs";
import { FormSectionRecord } from "../../record-form/records";

import Exports from "./component";

describe("<RecordActions /> - <Exports />", () => {
  const formSections = [
    {
      id: 1,
      unique_id: "form_section_1",
      parent_form: "case",
      module_ids: ["primeromodule-cp"],
      order: 1,
      form_group_id: "group_1",
      order_form_group: 2
    },
    {
      id: 2,
      unique_id: "form_section_2",
      parent_form: "case",
      module_ids: ["primeromodule-cp"],
      order: 2,
      form_group_id: "group_1",
      order_form_group: 2
    },
    {
      id: 5,
      unique_id: "form_section_5",
      parent_form: "case",
      module_ids: ["primeromodule-cp"],
      order: 1,
      form_group_id: "group_2",
      order_form_group: 1
    }
  ];

  const state = fromJS({
    records: {
      cases: {
        data: [
          {
            sex: "female",
            owned_by_agency_id: 1,
            record_in_scope: true,
            created_at: "2020-01-29T21:57:00.274Z",
            name: "User 1",
            alert_count: 0,
            case_id_display: "b575f47",
            owned_by: "primero_cp_ar",
            status: "open",
            registration_date: "2020-01-29",
            id: "b342c488-578e-4f5c-85bc-35ece34cccdf",
            flag_count: 0,
            short_id: "b575f47",
            age: 15,
            workflow: "new"
          }
        ],
        filters: {
          status: ["true"]
        }
      }
    },
    user: {
      permissions: {
        reports: [ACTIONS.MANAGE]
      }
    },
    forms: {
      formSections: mapEntriesToRecord(formSections, FormSectionRecord, true)
    }
  });
  const props = {
    open: true,
    close: () => {},
    recordType: RECORD_PATH.cases,
    userPermissions: fromJS(["manage"])
  };

  it("renders ActionDialog", () => {
    mountedComponent(<Exports {...props} />, state);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
