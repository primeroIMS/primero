import isEmpty from "lodash/isEmpty";

import { SERVICE_SECTION_FIELDS } from "../../../record-actions/transitions/components/referrals";
import { OPTION_TYPES } from "../../../form";
import { CUSTOM_STRINGS_SOURCE } from "../constants";

import appendDisabledUser from "./append-disabled-user";
import withStickyOption from "./with-sticky-option";

export default (name, option, value, options = [], stickyOption, filterState) => {
  const hasOptions = !isEmpty(options);

  if (option === OPTION_TYPES.AGENCY && hasOptions) {
    return withStickyOption(options, stickyOption, filterState?.filtersChanged);
  }

  if (
    hasOptions &&
    option === CUSTOM_STRINGS_SOURCE.user &&
    !filterState?.filtersChanged &&
    name.endsWith(SERVICE_SECTION_FIELDS.implementingAgencyIndividual)
  ) {
    return appendDisabledUser(options, value);
  }

  return withStickyOption(options, stickyOption);
};
