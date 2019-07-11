import isEmpty from "lodash/isEmpty";
import * as C from "./constants";

export const constructInitialValues = forms => {
  return !isEmpty(forms)
    ? Object.assign(
        {},
        ...forms.map(v =>
          Object.assign(
            {},
            ...v.fields.map(f => {
              let defaultValue;

              if (
                [
                  C.SUBFORM_SECTION,
                  C.PHOTO_FIELD,
                  C.AUDIO_FIELD,
                  C.DOCUMENT_FIELD
                ].includes(f.type) ||
                (f.type === C.SELECT_FIELD && f.multi_select)
              ) {
                defaultValue = [];
              } else if ([C.DATE_FIELD, C.TICK_FIELD].includes(f.type)) {
                defaultValue = null;
              } else {
                defaultValue = "";
              }

              return { [f.name]: defaultValue };
            })
          )
        )
      )
    : {};
};
