import { fromJS } from "immutable";
import { object, string } from "yup";

import { FieldRecord, FormSectionRecord, TICK_FIELD, TEXT_AREA, SELECT_FIELD, TEXT_FIELD } from "../../../form";
import { fetchReferralUsers } from "../action-creators";
import { LOOKUPS, RECORD_TYPES } from "../../../../config";

const requiredRemoteOrLocal = remote =>
  string().when("remoteSystem", {
    is: value => (remote ? value : !value),
    then: string().required()
  });

export const validations = object().shape({
  external_transitioned_to: requiredRemoteOrLocal(true),
  external_type_of_recipient: requiredRemoteOrLocal(true),
  transitioned_to: requiredRemoteOrLocal(false)
});

export const form = (i18n, { providedConsent, recordType }) => {
  return fromJS([
    FormSectionRecord({
      unique_id: "referrals",
      fields: [
        FieldRecord({
          display_name: i18n.t("transfer.consent_from_individual_label"),
          name: "consent_individual_transfer",
          type: TICK_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("transfer.is_remote_label"),
          name: "remoteSystem",
          type: TICK_FIELD
          // disabled: !providedConsent
        }),
        FieldRecord({
          display_name: i18n.t("referral.service_label"),
          name: "service",
          type: SELECT_FIELD,
          watchedInputs: "remoteSystem",
          showIf: value => !value,
          option_strings_source: LOOKUPS.service_type
          // disabled: !providedConsent
        }),
        FieldRecord({
          display_name: i18n.t("transfer.agency_label"),
          name: "agency",
          type: SELECT_FIELD,
          option_strings_source: "Agency",
          watchedInputs: "remoteSystem",
          showIf: value => !value,
          // disabled: !providedConsent,
          clearDependentValues: ["transitioned_to"],
          option_strings_source_id_key: "unique_id"
        }),
        FieldRecord({
          display_name: i18n.t("transfer.location_label"),
          name: "location",
          type: SELECT_FIELD,
          watchedInputs: "remoteSystem",
          showIf: value => !value,
          option_strings_source: LOOKUPS.reporting_locations,
          // disabled: !providedConsent,
          clearDependentValues: ["transitioned_to"]
        }),
        FieldRecord({
          display_name: i18n.t("transfer.recipient_label"),
          name: "transitioned_to",
          type: SELECT_FIELD,
          required: true,
          // disabled: !providedConsent,
          showIf: ({ remoteSystem }) => !remoteSystem,
          watchedInputs: ["agency", "location", "remoteSystem"],
          asyncOptions: true,
          asyncAction: fetchReferralUsers,
          asyncParams: { record_type: RECORD_TYPES[recordType] },
          asyncParamsFromWatched: ["agency", "location"],
          asyncOptionsLoadingPath: ["records", "transitions", "referral", "loading"],
          option_strings_source: "referToUsers"
        }),
        FieldRecord({
          display_name: i18n.t("transfer.notes_label"),
          name: "notes",
          watchedInputs: "remoteSystem",
          showIf: value => !value,
          type: TEXT_AREA
          // disabled: !providedConsent
        }),
        FieldRecord({
          display_name: i18n.t("transfer.external_type_of_recipient"),
          name: "external_type_of_recipient",
          required: true,
          watchedInputs: "remoteSystem",
          showIf: value => value,
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("transfer.external_transitioned_to"),
          name: "external_transitioned_to",
          required: true,
          watchedInputs: "remoteSystem",
          showIf: value => value,
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("transfer.external_agency"),
          name: "external_agency",
          watchedInputs: "remoteSystem",
          showIf: value => value,
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("transfer.filename"),
          name: "filename",
          watchedInputs: "remoteSystem",
          showIf: value => value,
          type: TEXT_FIELD
        })
      ]
    })
  ]);
};
