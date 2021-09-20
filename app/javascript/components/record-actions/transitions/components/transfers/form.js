import { fromJS } from "immutable";
import { object, string } from "yup";

import { RECORD_TYPES } from "../../../../../config";
import { FieldRecord, FormSectionRecord, OPTION_TYPES, SELECT_FIELD, TEXT_AREA, TICK_FIELD } from "../../../../form";
import ConsentProvided from "../../referrals/components/consent-provided";
import { fetchTransferUsers } from "../../action-creators";

import {
  AGENCY_FIELD,
  CONSENT_INDIVIDUAL_FIELD,
  LOCATION_FIELD,
  NOTES_FIELD,
  REMOTE_SYSTEM_FIELD,
  TRANSFER_FIELD,
  TRANSITIONED_TO_FIELD,
  TRANSFER_LOADING_PATH
} from "./constants";

export const form = ({
  canConsentOverride,
  i18n,
  isBulkTransfer,
  providedConsent,
  recordType,
  recordModuleID,
  setDisabled
}) => {
  return fromJS([
    FormSectionRecord({
      unique_id: "transfers_form",
      fields: [
        FieldRecord({
          display_name: i18n.t("transfer.transfer_label"),
          name: TRANSFER_FIELD,
          type: TICK_FIELD,
          wrapWithComponent: ConsentProvided,
          renderChildren: canConsentOverride,
          showIf: () => !providedConsent,
          watchedInputs: [TRANSFER_FIELD],
          handleWatchedInputs: ({ [TRANSFER_FIELD]: consent }) => {
            setDisabled(!!consent);
          }
        }),
        FieldRecord({
          display_name: i18n.t("transfer.consent_label"),
          name: TRANSFER_FIELD,
          type: TICK_FIELD,
          wrapWithComponent: ConsentProvided,
          visible: !!isBulkTransfer
        }),
        FieldRecord({
          display_name: i18n.t("transfer.is_remote_label"),
          name: REMOTE_SYSTEM_FIELD,
          type: TICK_FIELD,
          watchedInputs: [TRANSFER_FIELD],
          handleWatchedInputs: ({ [TRANSFER_FIELD]: consent }) => ({ disabled: !(consent || providedConsent) })
        }),
        FieldRecord({
          display_name: i18n.t("transfer.consent_from_individual_label"),
          name: CONSENT_INDIVIDUAL_FIELD,
          type: TICK_FIELD,
          watchedInputs: [TRANSFER_FIELD],
          handleWatchedInputs: ({ [TRANSFER_FIELD]: consent }) => ({ disabled: !(consent || providedConsent) })
        }),
        FieldRecord({
          name: AGENCY_FIELD,
          display_name: i18n.t("transfer.agency_label"),
          type: SELECT_FIELD,
          option_strings_source: OPTION_TYPES.AGENCY,
          option_strings_source_id_key: "unique_id",
          clearDependentValues: [TRANSITIONED_TO_FIELD],
          watchedInputs: [TRANSFER_FIELD],
          handleWatchedInputs: ({ [TRANSFER_FIELD]: consent }) => ({ disabled: !(consent || providedConsent) })
        }),
        FieldRecord({
          name: LOCATION_FIELD,
          display_name: i18n.t("transfer.location_label"),
          type: SELECT_FIELD,
          option_strings_source: OPTION_TYPES.REPORTING_LOCATIONS,
          clearDependentValues: [TRANSITIONED_TO_FIELD],
          watchedInputs: [TRANSFER_FIELD],
          handleWatchedInputs: ({ [TRANSFER_FIELD]: consent }) => ({ disabled: !(consent || providedConsent) })
        }),
        FieldRecord({
          name: TRANSITIONED_TO_FIELD,
          display_name: i18n.t("transfer.recipient_label"),
          required: true,
          watchedInputs: [AGENCY_FIELD, LOCATION_FIELD, TRANSITIONED_TO_FIELD, TRANSFER_FIELD],
          asyncOptions: true,
          asyncOptionsLoadingPath: TRANSFER_LOADING_PATH,
          asyncAction: fetchTransferUsers,
          asyncParams: { record_type: RECORD_TYPES[recordType], record_module_id: recordModuleID },
          asyncParamsFromWatched: [
            [AGENCY_FIELD, "agency"],
            [LOCATION_FIELD, "location"]
          ],
          type: SELECT_FIELD,
          option_strings_source: OPTION_TYPES.TRANSFER_TO_USERS,
          handleWatchedInputs: ({ [TRANSFER_FIELD]: consent }) => ({ disabled: !(consent || providedConsent) })
        }),
        FieldRecord({
          name: NOTES_FIELD,
          display_name: i18n.t("transfer.notes_label"),
          type: TEXT_AREA,
          watchedInputs: [TRANSFER_FIELD],
          handleWatchedInputs: ({ [TRANSFER_FIELD]: consent }) => ({ disabled: !(consent || providedConsent) })
        })
      ]
    })
  ]);
};

export const validations = i18n =>
  object().shape({
    [TRANSITIONED_TO_FIELD]: string().required(i18n.t("transfer.user_mandatory"))
  });
