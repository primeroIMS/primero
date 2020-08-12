import { fromJS } from "immutable";

import { FormSectionRecord } from "../record-form/records";
import { setupMountedComponent } from "../../test";
import InternalAlert from "../internal-alert";

import RecordFormAlerts from "./component";

describe("<RecordFormAlerts />", () => {
  const initialState = fromJS({
    records: {
      cases: {
        recordAlerts: [
          {
            alert_for: "field_change",
            type: "closure",
            date: "2020-06-19",
            form_unique_id: "form_1"
          }
        ]
      }
    },
    forms: {
      validationErrors: [
        {
          unique_id: "form_1",
          form_group_id: "group_1",
          errors: {
            field_1: "field_1 is required"
          }
        }
      ]
    }
  });

  it("renders the RecordFormAlerts", () => {
    const { component } = setupMountedComponent(
      RecordFormAlerts,
      {
        recordType: "cases",
        form: FormSectionRecord({ unique_id: "form_1", name: { en: "Form 1" } })
      },
      initialState
    );

    expect(component.find(RecordFormAlerts)).to.have.lengthOf(1);
  });

  it("first renders errors and then form alerts", () => {
    const { component } = setupMountedComponent(
      RecordFormAlerts,
      {
        recordType: "cases",
        form: FormSectionRecord({ unique_id: "form_1", name: { en: "Form 1" } })
      },
      initialState
    );

    expect(component.find(InternalAlert)).to.have.lengthOf(2);
    expect(component.find(InternalAlert).first().props().severity).to.equal("error");
    expect(component.find(InternalAlert).last().props().severity).to.equal("info");
  });
});
