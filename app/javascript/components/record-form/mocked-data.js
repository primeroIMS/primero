export default {
  data: [
    {
      id: "basic_identity",
      name: {
        en: "Basic Identity",
        ar: "Basic Identity (ar)"
      },
      visible: true,
      is_first_tab: true,
      order: 10,
      order_form_group: 30,
      parent: "case",
      editable: true,
      module: ["primeromodule-cp"],
      form_group_id: "identification_registration",
      fields: [
        {
          name: "case_id",
          type: "text_field",
          editable: true,
          disabled: false,
          visible: true,
          display_name: { en: "Long ID", ar: "Long ID (ar)" }
        },
        {
          name: "name",
          type: "text_field",
          editable: true,
          disabled: false,
          visible: true,
          display_name: { en: "Name", ar: "Name (ar)" }
        },
        {
          name: "age",
          type: "int",
          editable: true,
          disabled: false,
          visible: true,
          display_name: { en: "Age", ar: "Age (ar)" },
          help_text: {
            en: "Some help text (en)",
            ar: "Some help text (ar)"
          }
        }
      ]
    },
    {
      id: "assessment",
      name: {
        en: "Assessment",
        ar: "Assessment (ar)"
      },
      visible: true,
      is_first_tab: false,
      order: 12,
      order_form_group: 30,
      parent: "case",
      editable: true,
      module: ["primeromodule-cp"],
      form_group_id: "identification_registration",
      fields: [
        {
          name: "assessment_requested_by",
          type: "text_field",
          editable: true,
          disabled: false,
          visible: true,
          display_name: {
            en: "Assessment requested by",
            ar: "Assessment requested by (ar)"
          }
        },
        {
          name: "case_plan_due_date",
          type: "date_field",
          editable: true,
          disabled: false,
          visible: true,
          display_name: {
            en: "Date Case Plan Due",
            ar: "Date Case Plan Due (ar)"
          },
          help_text: {
            en: "dd-mmm-yyyy (en)",
            ar: "dd-mmm-yyyy (ar)"
          }
        },
        {
          name: "age",
          type: "int",
          editable: true,
          disabled: false,
          visible: true,
          display_name: { en: "Age", ar: "Age (ar)" },
          help_text: {
            en: "Some help text (en)",
            ar: "Some help text (ar)"
          }
        }
      ]
    },
    {
      id: "cp_case_plan",
      name: {
        en: "Case Plan",
        ar: "Case Plan (ar)"
      },
      visible: true,
      is_first_tab: true,
      order: 90,
      order_form_group: 32,
      parent: "case",
      editable: true,
      module: ["primeromodule-cp"],
      form_group_id: "case_plan",
      fields: [
        {
          name: "case_plan_approved_comments",
          type: "textarea",
          editable: true,
          disabled: false,
          visible: true,
          display_name: { en: "Manager Comments", ar: "Manager Comments (ar)" }
        },
        {
          name: "cp_case_plan_subform_case_plan_interventions",
          type: "subform",
          editable: true,
          disabled: false,
          visible: true,
          display_name: {
            en: "Intervention plans and services details",
            ar: "Intervention plans and services details (ar)"
          },
          subform_section: "cp_case_plan_subform_case_plan_interventions"
        }
      ]
    },
    {
      id: "cp_case_plan_subform_case_plan_interventions",
      name: {
        en: "List of Interventions and Services",
        ar: "List of Interventions and Services (ar)"
      },
      visible: true,
      is_subform: true,
      parent: "case",
      editable: true,
      fields: [
        {
          name: "case_plan_timeframe",
          type: "date_field",
          editable: true,
          disabled: false,
          visible: true,
          display_name: {
            en: "Expected timeframe (end date)",
            ar: "Expected timeframe (end date) (ar)"
          },
          help_text: {
            en: "dd-mmm-yyyy (en)",
            ar: "dd-mmm-yyyy (ar)"
          }
        },
        {
          name: "intervention_service_goal",
          type: "textarea",
          editable: true,
          disabled: false,
          visible: true,
          display_name: {
            en: "Goal of intervention / service",
            ar: "Goal of intervention / service (ar)"
          }
        }
      ]
    },
    {
      id: "tracing_request_inquirer",
      name: {
        en: "Inquirer",
        ar: "Inquirer (ar)"
      },
      visible: true,
      is_first_tab: true,
      order: 10,
      order_form_group: 30,
      parent: "tracing_request",
      editable: true,
      module: ["primeromodule-cp"],
      form_group_id: "inquirer",
      fields: [
        {
          name: "inquiry_date",
          type: "date_field",
          editable: true,
          disabled: false,
          visible: true,
          display_name: {
            en: "Date of Inquiry",
            ar: "Date of Inquiry (ar)"
          }
        },
        {
          name: "relation_name",
          type: "text_field",
          editable: true,
          disabled: false,
          visible: true,
          display_name: {
            en: "Name of inquirer",
            ar: "Name of inquirer (ar)"
          }
        }
      ]
    },
    {
      id: "cp_individual_details",
      name: {
        en: "CP Individual Details",
        ar: "CP Individual Details (ar)"
      },
      visible: true,
      is_first_tab: true,
      order: 10,
      order_form_group: 30,
      parent: "incident",
      editable: true,
      module: ["primeromodule-cp"],
      form_group_id: "cp_individual_details",
      fields: [
        {
          name: "age",
          type: "numeric_field",
          editable: true,
          disabled: false,
          visible: true,
          display_name: {
            en: "Age",
            ar: "Age (ar)"
          }
        },
        {
          name: "national_id_no",
          type: "text_field",
          editable: true,
          disabled: false,
          visible: true,
          display_name: {
            en: "National ID Number",
            ar: "National ID Number (ar)"
          }
        }
      ]
    }
  ]
};
