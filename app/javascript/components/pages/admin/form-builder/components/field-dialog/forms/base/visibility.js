import {
  FieldRecord,
  FormSectionRecord,
  LABEL_FIELD,
  TICK_FIELD
} from "../../../../../../../form";

export const visibilityFields = ({ fieldName, i18n }) => ({
  showOn: FieldRecord({
    display_name: i18n.t("fields.show_on"),
    name: `${fieldName}.show_on`,
    type: LABEL_FIELD
  }),
  visible: FieldRecord({
    display_name: i18n.t("fields.web_app"),
    name: `${fieldName}.visible`,
    type: TICK_FIELD
  }),
  mobileVisible: FieldRecord({
    display_name: i18n.t("fields.mobile_visible"),
    name: `${fieldName}.mobile_visible`,
    type: TICK_FIELD
  }),
  hideOnViewPage: FieldRecord({
    display_name: i18n.t("fields.hide_on_view_page"),
    name: `${fieldName}.hide_on_view_page`,
    type: TICK_FIELD
  }),
  showOnMinifyForm: FieldRecord({
    display_name: i18n.t("fields.show_on_minify_form"),
    name: `${fieldName}.show_on_minify_form`,
    type: TICK_FIELD
  }),
  onCollapsedSubform: FieldRecord({
    display_name: i18n.t("fields.on_collapsed_subform"),
    name: `${fieldName}.on_collapsed_subform`,
    type: TICK_FIELD
  })
});

export const visibilityForm = ({
  fieldName,
  fields = [],
  i18n,
  isNested = false
}) => {
  const {
    showOn,
    visible,
    mobileVisible,
    hideOnViewPage,
    showOnMinifyForm,
    onCollapsedSubform
  } = visibilityFields({ fieldName, i18n });

  const row = [visible, mobileVisible, hideOnViewPage].concat(
    isNested ? onCollapsedSubform : showOnMinifyForm
  );

  return FormSectionRecord({
    unique_id: "field_visibility",
    name: i18n.t("fields.visibility"),
    fields: fields.length ? fields : [showOn, { row }]
  });
};
