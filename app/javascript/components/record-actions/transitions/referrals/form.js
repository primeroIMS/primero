import { fromJS } from "immutable";
import { object, string, bool } from "yup";

import {
  FieldRecord,
  FormSectionRecord,
  TICK_FIELD,
  TEXT_AREA,
  SELECT_FIELD,
  TEXT_FIELD,
  OPTION_TYPES
} from "../../../form";
import { fetchReferralUsers } from "../action-creators";
import { fetchManagedRoles } from "../../../application/action-creators";
import { RECORD_TYPES } from "../../../../config";

import ConsentProvided from "./components/consent-provided";
import { FIELDS } from "./constants";

const commonHandleWatched = {
  handleWatchedInputs: ({ [FIELDS.CONSENT_INDIVIDUAL_TRANSFER]: consent }) => ({ disabled: !consent })
};

const localReferralFields = ({ i18n, recordType, isReferralFromService }) =>
  [
    {
      display_name: i18n.t("transfer.agency_label"),
      name: FIELDS.AGENCY,
      type: SELECT_FIELD,
      option_strings_source: OPTION_TYPES.AGENCY,
      watchedInputs: [FIELDS.REMOTE],
      showIf: values => !values[FIELDS.REMOTE],
      clearDependentValues: [FIELDS.TRANSITIONED_TO],
      option_strings_source_id_key: "unique_id"
    },
    {
      display_name: i18n.t("transfer.location_label"),
      name: FIELDS.LOCATION,
      type: SELECT_FIELD,
      watchedInputs: [FIELDS.REMOTE, FIELDS.TRANSITIONED_TO],
      showIf: values => !values[FIELDS.REMOTE],
      option_strings_source: OPTION_TYPES.REPORTING_LOCATIONS,
      clearDependentValues: [FIELDS.TRANSITIONED_TO]
    },
    {
      display_name: i18n.t("transfer.recipient_label"),
      name: FIELDS.TRANSITIONED_TO,
      type: SELECT_FIELD,
      required: true,
      showIf: values => !values[FIELDS.REMOTE],
      watchedInputs: [FIELDS.AGENCY, FIELDS.LOCATION, FIELDS.REMOTE],
      asyncOptions: true,
      asyncAction: fetchReferralUsers,
      asyncParams: { record_type: RECORD_TYPES[recordType] },
      asyncParamsFromWatched: [FIELDS.AGENCY, FIELDS.LOCATION],
      asyncOptionsLoadingPath: ["records", "transitions", "referral", "loading"],
      option_strings_source: OPTION_TYPES.REFER_TO_USERS,
      setOtherFieldValues: [
        {
          field: FIELDS.LOCATION,
          path: ["transitions", "referral", "users"],
          key: "location"
        },
        {
          field: FIELDS.AGENCY,
          path: ["transitions", "referral", "users"],
          key: "agency"
        }
      ]
    },
    {
      display_name: i18n.t("transfer.notes_label"),
      name: FIELDS.NOTES,
      watchedInputs: [FIELDS.REMOTE],
      showIf: values => !values[FIELDS.REMOTE],
      type: TEXT_AREA,
      disabled: false,
      ...commonHandleWatched
    }
  ].map(field => {
    field.watchedInputs.push(FIELDS.CONSENT_INDIVIDUAL_TRANSFER);

    return {
      internalFormFieldID: "local",
      disabled: isReferralFromService,
      handleWatchedInputs: ({ [FIELDS.CONSENT_INDIVIDUAL_TRANSFER]: consent }) => ({
        ...(!isReferralFromService && { disabled: !consent })
      }),
      ...field
    };
  });

const remoteReferralFields = ({ i18n, isExternalReferralFromService }) =>
  [
    {
      display_name: i18n.t("referral.type_of_referral"),
      name: FIELDS.ROLE,
      type: SELECT_FIELD,
      option_strings_source: OPTION_TYPES.ROLE_EXTERNAL_REFERRAL,
      asyncOptions: true,
      asyncAction: fetchManagedRoles,
      asyncOptionsLoadingPath: ["application", "loading"],
      asyncParamsFromWatched: [],
      required: true,
      ...commonHandleWatched
    },
    {
      display_name: i18n.t("transfer.agency_label"),
      name: FIELDS.AGENCY
    },
    {
      display_name: i18n.t("transfer.location_label"),
      name: FIELDS.LOCATION
    },
    {
      display_name: i18n.t("transfer.recipient_label"),
      name: FIELDS.TRANSITIONED_TO_REMOTE,
      required: true
    }
  ].map(field => {
    return {
      internalFormFieldID: "remote",
      type: TEXT_FIELD,
      disabled: isExternalReferralFromService,
      watchedInputs: [FIELDS.REMOTE, FIELDS.CONSENT_INDIVIDUAL_TRANSFER],
      handleWatchedInputs: ({ [FIELDS.CONSENT_INDIVIDUAL_TRANSFER]: consent }) => ({
        ...(!isExternalReferralFromService && { disabled: !consent })
      }),
      showIf: values => values[FIELDS.REMOTE],
      ...field
    };
  });

const commonReferralFields = ({ isReferralFromService, isExternalReferralFromService, i18n }) =>
  [
    {
      display_name: i18n.t("transfer.is_remote_label"),
      name: FIELDS.REMOTE,
      type: TICK_FIELD,
      disabled: isReferralFromService,
      showIf: () => !isReferralFromService || isExternalReferralFromService
    },
    {
      display_name: i18n.t("referral.service_label"),
      name: FIELDS.SERVICE,
      type: SELECT_FIELD,
      option_strings_source: OPTION_TYPES.SERVICE_TYPE,
      disabled: isReferralFromService
    }
  ].map(field => {
    return {
      watchedInputs: [FIELDS.CONSENT_INDIVIDUAL_TRANSFER],
      handleWatchedInputs: ({ [FIELDS.CONSENT_INDIVIDUAL_TRANSFER]: consent }) => ({
        ...(!isReferralFromService && { disabled: !consent })
      }),
      ...field
    };
  });

const referralFields = args =>
  [
    {
      display_name: args.i18n.t("referral.refer_anyway_label"),
      name: FIELDS.CONSENT_INDIVIDUAL_TRANSFER,
      type: TICK_FIELD,
      wrapWithComponent: ConsentProvided,
      showIf: () => !args.providedConsent
    },
    ...commonReferralFields(args),
    ...localReferralFields(args),
    ...remoteReferralFields(args)
  ].map(field => FieldRecord(field));

const validWhenRemote = isRemote =>
  string().when(FIELDS.REMOTE, {
    is: value => value === isRemote,
    then: string().required()
  });

export const validations = object().shape({
  [FIELDS.CONSENT_INDIVIDUAL_TRANSFER]: bool().oneOf([true]),
  [FIELDS.ROLE]: validWhenRemote(true).nullable(),
  [FIELDS.TRANSITIONED_TO]: validWhenRemote(false),
  [FIELDS.TRANSITIONED_TO_REMOTE]: validWhenRemote(true)
});

export const form = args => {
  return fromJS([
    FormSectionRecord({
      unique_id: "referrals",
      fields: referralFields(args)
    })
  ]);
};
