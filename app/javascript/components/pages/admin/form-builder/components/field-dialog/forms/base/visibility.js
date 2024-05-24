// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import {
  DOCUMENT_RECORD_FIELD,
  FieldRecord,
  FormSectionRecord,
  LABEL_FIELD,
  TICK_FIELD
} from "../../../../../../../form";

export const visibilityFields = ({ fieldName, i18n, limitedProductionSite }) => ({
  showOn: FieldRecord({
    display_name: i18n.t("fields.show_on"),
    name: `${fieldName}.show_on`,
    type: LABEL_FIELD,
    disabled: limitedProductionSite
  }),
  visible: FieldRecord({
    display_name: i18n.t("fields.web_app"),
    name: `${fieldName}.visible`,
    type: TICK_FIELD,
    disabled: limitedProductionSite
  }),
  skipLogic: FieldRecord({
    display_name: i18n.t("fields.skip_logic.name"),
    name: `${fieldName}.skip_logic`,
    type: TICK_FIELD,
    disabled: limitedProductionSite
  }),
  mobileVisible: FieldRecord({
    display_name: i18n.t("fields.mobile_visible"),
    name: `${fieldName}.mobile_visible`,
    type: TICK_FIELD,
    disabled: limitedProductionSite
  }),
  hideOnViewPage: FieldRecord({
    display_name: i18n.t("fields.hide_on_view_page"),
    name: `${fieldName}.hide_on_view_page`,
    type: TICK_FIELD,
    disabled: limitedProductionSite
  }),
  showOnMinifyForm: FieldRecord({
    display_name: i18n.t("fields.show_on_minify_form"),
    name: `${fieldName}.show_on_minify_form`,
    type: TICK_FIELD,
    disabled: limitedProductionSite
  }),
  onCollapsedSubform: FieldRecord({
    display_name: i18n.t("fields.on_collapsed_subform"),
    name: `${fieldName}.on_collapsed_subform`,
    type: TICK_FIELD,
    disabled: limitedProductionSite
  })
});

export const visibilityForm = ({
  fieldName,
  fieldType,
  fields = [],
  i18n,
  isNested = false,
  limitedProductionSite
}) => {
  const { showOn, visible, mobileVisible, hideOnViewPage, showOnMinifyForm, onCollapsedSubform, skipLogic } =
    visibilityFields({
      fieldName,
      i18n,
      limitedProductionSite
    });

  const miniFormField = fieldType === DOCUMENT_RECORD_FIELD ? [] : [showOnMinifyForm];

  const row = [visible, mobileVisible, hideOnViewPage]
    .concat(isNested && fieldType !== DOCUMENT_RECORD_FIELD ? onCollapsedSubform : miniFormField)
    .concat(skipLogic);

  return FormSectionRecord({
    unique_id: "field_visibility",
    name: i18n.t("fields.visibility"),
    fields: fields.length ? fields : [showOn, { row }]
  });
};
