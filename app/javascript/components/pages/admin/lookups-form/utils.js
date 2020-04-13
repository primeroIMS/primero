import { fromJS } from "immutable";
import * as yup from "yup";

import {
  FieldRecord,
  FormSectionRecord,
  TEXT_FIELD,
  SELECT_FIELD,
  LABEL_FIELD
} from "../../../form";
import { dataToJS } from "../../../../libs";

export const validations = i18n =>
  yup.object().shape({
    name: yup
      .string()
      .required()
      .label(i18n.t("form_section.required_field", { field: "English Text" }))
  });

export const form = (i18n, options, hiddenClass) => {
  return fromJS([
    FormSectionRecord({
      unique_id: "lookups",
      fields: [
        FieldRecord({
          display_name: "Languague",
          name: "options",
          type: SELECT_FIELD,
          option_strings_text: options,
          editable: !(options?.length === 1),
          disabled: options?.length === 1
        }),
        FieldRecord({
          display_name: "English Text",
          name: "name",
          type: TEXT_FIELD,
          required: true
        }),
        FieldRecord({
          display_name: "Translation Text",
          name: "translated_name",
          type: TEXT_FIELD,
          hiddenClass
        })
        // TODO: When prim-1820 is implemented uncomment this
        // FieldRecord({
        //   display_name: "Options",
        //   type: LABEL_FIELD
        // })
      ]
    })
  ]);
};

export const translateValues = (values, locale) => {
  const data = dataToJS(values);

  return data.reduce(
    (acc, curr) => [
      ...acc,
      { ...curr, display_text: curr.display_text[locale] || "" }
    ],
    []
  );
};
