/* eslint-disable import/prefer-default-export */

export const referralAgencyName = (transition, agencies) => {
  if (!transition.remote && transition.transitioned_to_agency) {
    return agencies.find(agency => agency.id === transition.transitioned_to_agency).display_text;
  }

  // eslint-disable-next-line camelcase
  return transition?.transitioned_to_agency;
};
