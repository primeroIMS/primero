/* eslint-disable import/prefer-default-export */
import { SERVICE_SECTION_FIELDS_EXTERNAL, SERVICE_SECTION_FIELDS } from "./constants";

export const mapServiceFields = (serviceToRefer, isExternalReferralFromService) => {
  const servicesFields = isExternalReferralFromService ? SERVICE_SECTION_FIELDS_EXTERNAL : SERVICE_SECTION_FIELDS;

  return Object.keys(servicesFields).reduce((prev, key) => {
    const obj = prev;
    const serviceValue = serviceToRefer.get(servicesFields[key], false);

    if (serviceValue) {
      obj[key] = serviceValue;
    }

    return obj;
  }, {});
};
