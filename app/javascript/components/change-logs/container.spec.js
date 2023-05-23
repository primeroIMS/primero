import { mountedComponent, screen } from "test-utils";
import { fromJS, OrderedMap } from "immutable";
import { ChangeLogsRecord } from "./records";
import { FieldRecord } from "../record-form";
import ChangeLogs from "./container";

describe("ChangeLogs - Container", () => {
    const props = {
        handleToggleNav: () => { },
        mobileDisplay: false,
        recordID: "38c82975-99aa-4798-9c3d-dabea104d992",
        recordType: "cases",
        fetchable: true
    };
    const defaultState = fromJS({
        records: {
            changeLogs: {
                data: [
                    ChangeLogsRecord({
                        record_id: "38c82975-99aa-4798-9c3d-dabea104d992",
                        record_type: "cases",
                        datetime: "2020-08-11T10:27:33Z",
                        user_name: "primero",
                        action: "update",
                        record_changes: [
                            {
                                nationality: { to: ["canada", "australia"], from: ["canada"] }
                            },
                            { name_nickname: { to: "Pat", from: null } },
                            { national_id_no: { to: "0050M", from: null } },
                            {
                                alleged_perpetrator: {
                                    to: [
                                        {
                                            age_group: "12_17",
                                            unique_id: "66df14a7-5382-44de-bc70-5a9633355bf4",
                                            perpetrator_sex: "female",
                                            former_perpetrator: false,
                                            primary_perpetrator: "primary",
                                            perpetrator_ethnicity: "ethnicity1",
                                            perpetrator_occupation: "occupation_4",
                                            perpetrator_nationality: "nationality2"
                                        }
                                    ],
                                    from: null
                                }
                            }
                        ]
                    }),
                    ChangeLogsRecord({
                        record_id: "38c82975-99aa-4798-9c3d-dabea104d992",
                        record_type: "cases",
                        datetime: "2020-08-10T18:27:33Z",
                        user_name: "primero",
                        action: "create",
                        record_changes: []
                    })
                ]
            }
        },
        forms: fromJS({
            fields: OrderedMap({
                0: FieldRecord({
                    id: 1,
                    name: "name_nickname",
                    type: "text_field",
                    editable: true,
                    disabled: null,
                    visible: true,
                    display_name: {
                        en: "Nickname"
                    },
                    subform_section_id: null,
                    help_text: {},
                    multi_select: null,
                    option_strings_source: null,
                    option_strings_text: null,
                    guiding_questions: "",
                    required: true,
                    date_validation: "default_date_validation"
                }),
                1: FieldRecord({
                    id: 1,
                    name: "nationality",
                    type: "select_box",
                    editable: true,
                    disabled: null,
                    visible: true,
                    display_name: {
                        en: "Nationality"
                    },
                    subform_section_id: null,
                    help_text: {},
                    multi_select: null,
                    option_strings_source: "lookup lookup-country",
                    option_strings_text: null,
                    guiding_questions: "",
                    required: true,
                    date_validation: "default_date_validation"
                }),
                2: FieldRecord({
                    id: 1,
                    name: "national_id_no",
                    type: "text_field",
                    editable: true,
                    disabled: null,
                    visible: true,
                    display_name: {
                        en: "National ID Number"
                    },
                    subform_section_id: null,
                    help_text: {},
                    multi_select: null,
                    option_strings_source: null,
                    option_strings_text: null,
                    guiding_questions: "",
                    required: true,
                    date_validation: "default_date_validation"
                }),
                3: FieldRecord({
                    id: 1,
                    name: "alleged_perpetrator",
                    type: "subform",
                    editable: true,
                    disabled: null,
                    visible: true,
                    display_name: {
                        en: "Alleged Perpetrator"
                    },
                    subform_section_id: null,
                    help_text: {},
                    multi_select: null,
                    option_strings_source: null,
                    option_strings_text: null,
                    guiding_questions: "",
                    required: true,
                    date_validation: "default_date_validation"
                })
            })
        })
    });

    beforeEach(() => {
        mountedComponent(<ChangeLogs {...props} />, defaultState);
    });

    it("renders ChangeLogs", () => {
        expect(screen.getAllByRole('container')).toHaveLength(1);
    });

    it("renders ChangeLog", () => {
        const element = screen.getByText("change_logs.create");
        expect(element).toBeInTheDocument();
    });

    it("renders SubformDialog", () => {
        const element = screen.getByText("change_logs.update_subform");
        expect(element).toBeInTheDocument();
    });

    it("renders ChangeLogItem", () => {
        expect(screen.getAllByRole('timeline')).toHaveLength(5);
    });

    describe("when filters are selected", () => {
        it("renders only the selected field names", () => {
            const selectedForm = "changeLog";
            mountedComponent(<ChangeLogs {...props} />, defaultState.setIn(["ui", "formFilters", selectedForm], fromJS({ field_names: ["nationality"] })));
            expect(screen.getAllByRole('timeline')).toHaveLength(10);
        });
    });
});

