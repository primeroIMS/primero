import { SERVICE_SECTION_FIELDS } from "../../../record-actions/transitions/components/referrals";

export default () => ({
  service: SERVICE_SECTION_FIELDS.type,
  agency: SERVICE_SECTION_FIELDS.implementingAgency,
  location: SERVICE_SECTION_FIELDS.deliveryLocation,
  user: SERVICE_SECTION_FIELDS.implementingAgencyIndividual
});
