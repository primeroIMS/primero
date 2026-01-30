// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { isEmpty, isNil } from "lodash";

import { ROUTES } from "../../config";

/* eslint-disable import/prefer-default-export */
export const getPathToRedirect = ({
  agencyTermsOfUseEnabled,
  agencyTermsOfUseAcceptedChanged,
  termsOfUseAcceptedOn,
  path,
  codeOfConductEnabled,
  codeOfConductAccepted,
  codeOfConduct
}) => {
  if (
    (agencyTermsOfUseAcceptedChanged || (agencyTermsOfUseEnabled && isNil(termsOfUseAcceptedOn))) &&
    ![ROUTES.logout, ROUTES.login, ROUTES.terms_of_use].includes(path)
  ) {
    return ROUTES.terms_of_use;
  }

  if (
    codeOfConductEnabled &&
    !codeOfConductAccepted &&
    !isEmpty(codeOfConduct) &&
    ![ROUTES.logout, ROUTES.login, ROUTES.code_of_conduct, ROUTES.terms_of_use].includes(path)
  ) {
    return ROUTES.code_of_conduct;
  }

  return null;
};
