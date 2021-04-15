export const NAME = "FieldDialog";
export const ADMIN_FIELDS_DIALOG = "admin_fields_dialog";
export const DATE_FIELD_CUSTOM_VALUES = Object.freeze({
  date_validation: Object.freeze({
    not_future_date: true,
    default_date_validation: false
  }),
  selected_value: Object.freeze({
    withTime: Object.freeze({
      now: true,
      "": false
    }),
    withoutTime: Object.freeze({
      today: true,
      f: false
    })
  })
});

export const FIELD_FORM = "field-form";

export const FIELD_TRANSLATABLE_OPTIONS = [
  "display_name",
  "help_text",
  "guiding_questions",
  "tick_box_label",
  "option_strings_text"
];

export const SUBFORM_TRANSLATABLE_OPTIONS = ["name", "description"];

export const RESET_OPTIONS = Object.freeze({ errors: true, dirtyFields: true, isDirty: true, touched: true });
