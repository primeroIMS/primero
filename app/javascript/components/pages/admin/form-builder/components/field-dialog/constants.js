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
