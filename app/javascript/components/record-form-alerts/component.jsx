import PropTypes from "prop-types";
import { fromJS, List, Map } from "immutable";
import { useDispatch } from "react-redux";

import { ALERTS_FOR, PENDING_TRANSITION_ALERTS } from "../../config";
import { useI18n } from "../i18n";
import InternalAlert from "../internal-alert";
import useMemoizedSelector from "../../libs/use-memoized-selector";
import { getRecordFormAlerts, getSelectedRecord, deleteAlertFromRecord, usePendingTransitionAlerts } from "../records";
import { getSubformsDisplayName, getValidationErrors, getDuplicatedFields } from "../record-form/selectors";
import { usePermissions, REMOVE_ALERT } from "../permissions";
import FormLinkMessage from "../record-form/components/form-link-message";

import { getMessageData } from "./utils";
import { NAME } from "./constants";

function Component({ form, recordType, attachmentForms = fromJS([]), formMode, record, primeroModule }) {
  const i18n = useI18n();

  const dispatch = useDispatch();

  const recordAlerts = useMemoizedSelector(state => getRecordFormAlerts(state, recordType, form.unique_id));
  const validationErrors = useMemoizedSelector(state => getValidationErrors(state, form.unique_id));
  const subformDisplayNames = useMemoizedSelector(state => getSubformsDisplayName(state, i18n.locale));
  const duplicatedFields = useMemoizedSelector(state => getDuplicatedFields(state, recordType, form.unique_id));
  const selectedRecord = useMemoizedSelector(state => getSelectedRecord(state, recordType));
  const hasDismissPermission = usePermissions(recordType, REMOVE_ALERT);
  const pendingTransitionAlerts = usePendingTransitionAlerts(record, primeroModule);

  const showDismissButton = () => {
    return hasDismissPermission && formMode.isShow;
  };

  const errors =
    validationErrors?.size &&
    validationErrors
      .get("errors", fromJS([]))
      .entrySeq()
      .map(([key, value]) => {
        if (List.isList(value)) {
          return fromJS({
            message: i18n.t("error_message.address_subform_fields", {
              subform: subformDisplayNames.get(key) || attachmentForms.getIn([key, i18n.locale], ""),
              fields: value.filter(subform => Boolean(subform)).flatMap(subform => subform.keySeq()).size
            })
          });
        }

        return fromJS({ message: value });
      });

  const pendingTransitionItems = pendingTransitionAlerts
    .filter(alert => alert.get("form_unique_id") === form.unique_id)
    .map(alert => {
      const { messageKey, linkKey, transitionFormUniqueId } = PENDING_TRANSITION_ALERTS[alert.get("type")];

      return Map({
        message: <FormLinkMessage messageKey={messageKey} linkKey={linkKey} formUniqueId={transitionFormUniqueId} />,
        onDismiss: null
      });
    });

  const alertItems = recordAlerts.map(alert => {
    const messageData = getMessageData({ alert, form, duplicatedFields, i18n });

    return fromJS({
      message: [ALERTS_FOR.transfer, ALERTS_FOR.referral].includes(alert.get("alert_for"))
        ? messageData
        : i18n.t(`messages.alerts_for.${alert.get("alert_for")}`, messageData),
      onDismiss: showDismissButton()
        ? () => {
            dispatch(deleteAlertFromRecord(recordType, selectedRecord, alert.get("unique_id")));
          }
        : null
    });
  });

  const items = alertItems.concat(pendingTransitionItems);

  return (
    <>
      {errors?.size ? (
        <InternalAlert
          title={i18n.t("error_message.address_form_fields", {
            fields: errors?.size
          })}
          items={fromJS(errors)}
          severity="error"
        />
      ) : null}
      {items?.size ? <InternalAlert items={fromJS(items)} /> : null}
    </>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  attachmentForms: PropTypes.object,
  form: PropTypes.object.isRequired,
  formMode: PropTypes.object,
  primeroModule: PropTypes.string,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired
};

export default Component;
