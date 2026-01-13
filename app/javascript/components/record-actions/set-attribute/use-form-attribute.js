import { fromJS } from "immutable";
import { object, string } from "yup";
import { debounce } from "lodash";
import { useDispatch } from "react-redux";

import { useI18n } from "../../i18n";
import { FieldRecord, FormSectionRecord, OPTION_TYPES, SELECT_FIELD } from "../../form";

import { fetchUsersIdentified } from "./action-creators";

function useFormAttribute() {
  const dispatch = useDispatch();
  const i18n = useI18n();

  const debouncedFetch = debounce(value => {
    if (value && value.length >= 2) {
      dispatch(fetchUsersIdentified({ data: { query: value } }));
    }
  }, 500);

  const formSections = fromJS([
    FormSectionRecord({
      unique_id: "form_attribute",
      fields: [
        FieldRecord({
          name: "identified_by",
          required: true,
          display_name: { [i18n.locale]: i18n.t("user.label") },
          placeholder: i18n.t("cases.attribute.identified_by_placeholder"),
          type: SELECT_FIELD,
          asyncOptions: true,
          asyncAction: null,
          asyncOptionsLoadingPath: ["forms", "options", "users", "loading"],
          asyncParamsFromWatched: [],
          onInputChange: (_, value, reason) => {
            if (reason === "input") {
              debouncedFetch(value);
            }
          },
          option_strings_source: OPTION_TYPES.USER_IDENTIFIED
        })
      ]
    })
  ]);

  const validationSchema = object().shape({
    identified_by: string()
      .nullable()
      .required(i18n.t("forms.required_field", { field: i18n.t("user.label") }))
  });

  return {
    formSections,
    validationSchema
  };
}

export default useFormAttribute;
