import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import { FormSectionRecord } from "../record-form/records";
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
                        field_1: "field_1 is required",
                        tally_2: {
                            boys: "Boys is required"
                        }
                    }
                }
            ]
        }
    });

    it("renders the RecordFormAlerts", () => {
        const props = {
            recordType: "cases",
        form: FormSectionRecord({ unique_id: "form_1", name: { en: "Form 1" } })
        }
        mountedComponent(<RecordFormAlerts {...props} />, initialState);
        expect(document.querySelector("#record-form-alerts-panel-header")).toBeInTheDocument();
    });

    it("first renders errors and then form alerts", () => {
        const props = {
            recordType: "cases",
            form: FormSectionRecord({ unique_id: "form_1", name: { en: "Form 1" } })
        }
        mountedComponent(<RecordFormAlerts {...props} />, initialState);
        expect(screen.getByText("error_message.address_form_fields.")).toBeInTheDocument();
    });
});
