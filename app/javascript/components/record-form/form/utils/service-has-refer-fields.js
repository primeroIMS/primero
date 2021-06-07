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
