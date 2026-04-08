import { useCallback, useState } from "react";
import { useWatch } from "react-hook-form";

import { PHONETIC_FIELD_NAME, PHONE_NUMBER_FIELD_NAME } from "./constants";

function useSearchBox() {
  const phonetic = useWatch({ name: PHONETIC_FIELD_NAME, defaultValue: false });
  const phoneNumber = useWatch({ name: PHONE_NUMBER_FIELD_NAME, defaultValue: false });
  const [phoneError, setPhoneError] = useState();
  const searchField = (phonetic && "phonetic") || (phoneNumber && "phone_number") || "id_search";
  const handleInvalidNumber = useCallback(error => {
    setPhoneError(error);
  }, []);

  return { searchField, phonetic, phoneNumber, phoneError, handleInvalidNumber };
}

export default useSearchBox;
