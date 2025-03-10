import { fromJS, OrderedMap } from "immutable";

import { mountedComponent, screen } from "../../../test-utils";
import { ListHeaderRecord } from "../../user/records";
import { FieldRecord, FormSectionRecord } from "../../record-form/records";

import TaskList from "./container";

describe("<TaskList />", () => {
  const state = fromJS({
    records: {
      tasks: {
        data: [
          {
            id: "0df32f52-4290-4ce1-b859-74ac14c081bf",
            record_type: "case",
            record_id_display: "040e0b7",
            priority: "high",
            type: "service",
            due_date: "2019-07-01",
            detail: "a",
            field_name: "test",
            completion_field: "test_service"
          },
          {
            id: "0df32f52-4290-4ce1-b859-74ac14c081bf",
            record_type: "case",
            record_id_display: "040e0b7",
            priority: "low",
            type: "case_plan",
            due_date: "2019-07-02",
            detail: "b",
            field_name: "case_plan_due_date",
            completion_field: "case_plan_due_date"
          },
          {
            id: "f1288fad-1c15-4f9f-b976-1f77d6356955",
            overdue: true,
            priority: "medium",
            record_type: "case",
            record_id_display: "726b7db",
            detail: "c",
            due_date: "2019-09-01",
            type: "follow_up",
            type_display: "Follow Up - Follow up for Assessment",
            upcoming_soon: false,
            field_name: "test_follow_up",
            completion_field: "test_follow_up"
          }
        ],
        metadata: {
          total: 2,
          per: 20,
          page: 1,
          field_names: {
            assessment: "test_assessment",
            case_plan: "case_plan_due_date",
            service: "test_service",
            follow_up: "test_follow_up"
          }
        }
      }
    },
    user: {
      listHeaders: {
        tasks: [
          ListHeaderRecord({
            name: "id",
            field_name: "record_id_display",
            id_search: false
          }),
          ListHeaderRecord({
            name: "priority",
            field_name: "priority",
            id_search: false
          }),
          ListHeaderRecord({
            name: "type",
            field_name: "type",
            id_search: false
          }),
          ListHeaderRecord({
            name: "due_date",
            field_name: "due_date",
            id_search: false
          }),
          ListHeaderRecord({
            name: "status",
            field_name: "status",
            id_search: false
          })
        ]
      }
    },
    forms: {
      formSections: OrderedMap({
        1: FormSectionRecord({
          id: 1,
          unique_id: "cp_incident_record_owner",
          parent_form: "incident",
          name: { en: "Form name" },
          fields: [1]
        }),
        2: FormSectionRecord({
          id: 2,
          unique_id: "assessment",
          parent_form: "case",
          name: { en: "Assessment" },
          fields: [2],
          is_nested: false
        }),
        3: FormSectionRecord({
          id: 3,
          unique_id: "followup",
          parent_form: "case",
          name: { en: "followup" },
          fields: [3],
          is_nested: false
        })
      }),
      fields: OrderedMap({
        1: FieldRecord({
          id: 1,
          name: "test_service",
          display_name: { en: "Test Field" },
          type: "text_field",
          multi_select: false,
          form_section_id: 1,
          visible: true,
          mobile_visible: true
        }),
        2: FieldRecord({
          id: 2,
          name: "case_plan_due_date",
          display_name: { en: "Case Plan Due Date" },
          type: "text_field",
          multi_select: false,
          form_section_id: 2,
          visible: true,
          mobile_visible: true
        }),
        3: FieldRecord({
          id: 3,
          name: "test_follow_up",
          display_name: { en: "Followup" },
          type: "text_field",
          multi_select: false,
          form_section_id: 2,
          visible: true,
          mobile_visible: true
        })
      }),
      options: {
        lookups: [
          {
            id: 1,
            unique_id: "lookup-service-type",
            values: [
              { id: "a", display_text: { en: "Service a" } },
              { id: "b", display_text: { en: "Service b" } }
            ]
          }
        ]
      }
    }
  });

  it("should render tasks table", () => {
    mountedComponent(<TaskList />, state);
    expect(screen.getAllByRole("row")).toHaveLength(5);
  });

  it("should render tasks table with priority as DashboardChip", () => {
    mountedComponent(<TaskList />, state);

    expect(screen.getAllByTestId("chip-button")).toHaveLength(3);
  });

  it("should render the task type", () => {
    mountedComponent(<TaskList />, state);

    expect(screen.getByText("task.types.service")).toBeInTheDocument();
    expect(screen.getByText("task.types.case_plan")).toBeInTheDocument();
    expect(screen.getByText("task.types.follow_up")).toBeInTheDocument();
  });
});
