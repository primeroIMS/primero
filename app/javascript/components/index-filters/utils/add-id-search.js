import {
  FIELD_NAME_ID_SEARCH,
  FIELD_NAME_QUERY,
  PHONE_NUMBER_FIELD_NAME,
  PHONETIC_FIELD_NAME
} from "../components/search-box/constants";

export default data => {
  if (!data[FIELD_NAME_QUERY]) return data;

  const isPhonetic = data[PHONETIC_FIELD_NAME] === "true" || data[PHONETIC_FIELD_NAME] === true;
  const isPhoneNumber = data[PHONE_NUMBER_FIELD_NAME] === "true" || data[PHONE_NUMBER_FIELD_NAME] === true;

  if (isPhonetic || isPhoneNumber) return data;

  return { ...data, [FIELD_NAME_ID_SEARCH]: true };
};
