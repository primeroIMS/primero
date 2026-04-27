import { useCallback, useState } from "react";
import { useWatch } from "react-hook-form";

import { FIELD_NAME_ID_SEARCH, FIELD_NAME_QUERY, PHONETIC_FIELD_NAME, PHONE_NUMBER_FIELD_NAME } from "./constants";

function useSearchBox({ control, setValue }) {
  const phonetic = useWatch({ control, name: PHONETIC_FIELD_NAME, defaultValue: false });
  const phoneNumber = useWatch({ control, name: PHONE_NUMBER_FIELD_NAME, defaultValue: false });
  const isPhoneNumber = phoneNumber === "true" || phoneNumber === true;
  const isPhonetic = phonetic === "true" || phonetic === true;
  const [phoneError, setPhoneError] = useState();
  const searchField = (isPhonetic && "phonetic") || (isPhoneNumber && "phone_number") || "id_search";
  const handleInvalidNumber = useCallback(error => {
    setPhoneError(error);
  }, []);

  const handleToggleChange = useCallback(
    event => {
      const { value } = event.target;

      setValue(FIELD_NAME_ID_SEARCH, value === FIELD_NAME_ID_SEARCH);
      setValue(PHONETIC_FIELD_NAME, value === PHONETIC_FIELD_NAME);

      // NOTE: Avoid invalid phone numbers when a user switches to phone number search
      if (value === PHONE_NUMBER_FIELD_NAME) {
        setValue(FIELD_NAME_QUERY, "");
        setValue(PHONE_NUMBER_FIELD_NAME, true);
      } else {
        setValue(PHONE_NUMBER_FIELD_NAME, false);
      }
    },
    [setValue]
  );

  return { searchField, isPhonetic, isPhoneNumber, phoneError, handleInvalidNumber, handleToggleChange };
}

export default useSearchBox;
