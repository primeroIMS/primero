import { fromJS } from "immutable";

import { setupMountedComponent } from "../../test";

import RecordFormAlerts from "./component";

describe("<RecordFormAlerts />", () => {
  const initialState = fromJS({
    record: {
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
    }
  });

  it("renders the RecordFormAlerts", () => {
    const { component } = setupMountedComponent(
      RecordFormAlerts,
      {
        recordType: "case",
        form: fromJS({ unique_id: "form_1", name: { en: "Form 1" } })
      },
      initialState
    );

    expect(component.find(RecordFormAlerts)).to.have.lengthOf(1);
  });
});
