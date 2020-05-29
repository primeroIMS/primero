import { fromJS } from "immutable";

import {
  FormSectionRecord,
  FieldRecord,
  SELECT_FIELD,
  TEXT_FIELD
} from "../../../form";
import { CONSTRAINTS } from "../../constants";

export default (i18n, fieldName, fields) =>
  fromJS([
    FormSectionRecord({
      unique_id: "reportFilter",
      fields: [
        FieldRecord({
          display_name: i18n.t("report.attribute"),
          name: `${fieldName}.attribute`,
          type: SELECT_FIELD,
          groupBy: "formSection",
          option_strings_text: fields
        }),
        FieldRecord({
          display_name: i18n.t("report.constraint"),
          name: `${fieldName}.constraint`,
          type: SELECT_FIELD,
          option_strings_text: Object.entries(CONSTRAINTS).map(value => {
            // eslint-disable-next-line camelcase
            const [id, display_text] = value;

            return {
              id,
              display_text
            };
          })
        }),
        FieldRecord({
          display_name: i18n.t("report.value"),
          name: `${fieldName}.value`,
          type: TEXT_FIELD
        })
      ]
    })
  ]);
