// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default service => {
  if (!service) {
    return false;
  }

  const {
    service_implementing_agency_individual: serviceImplementingAgencyIndividual,
    service_external_referral: serviceExternalReferral
  } = service;

  return serviceImplementingAgencyIndividual || serviceExternalReferral;
};
