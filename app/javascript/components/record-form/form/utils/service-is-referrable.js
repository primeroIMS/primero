export default (service, services, agencies, users = []) => {
  const {
    service_external_referral: serviceExternalReferral,
    service_type: serviceType,
    service_implementing_agency: agencyUniqueId,
    service_implementing_agency_individual: userName
  } = service;

  if (serviceExternalReferral) {
    return true;
  }

  if (services.find(type => type.id === serviceType)) {
    const serviceUser = users.find(
      user => user.get("user_name") === userName && user.get("services")?.includes(serviceType)
    );

    if (serviceUser && agencyUniqueId) {
      const serviceAgency = agencies.find(
        agency => agency.get("unique_id") === agencyUniqueId && agency.get("services")?.includes(serviceType)
      );

      if (!serviceAgency) {
        return false;
      }

      return serviceUser.get("agency") === agencyUniqueId;
    }

    if (serviceUser) {
      return true;
    }
  }

  return false;
};
