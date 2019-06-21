export default {
  data: [
    {
      id: "form-id",
      name: {
        en: "Case ID",
        ar: "Case ID (ar)"
      },
      visible: true,
      is_first_tab: true,
      order: 10,
      order_form_group: 30,
      parent: "case",
      editable: true,
      fields: [
        {
          name: "name",
          type: "text",
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
    }
  ]
};
