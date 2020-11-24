import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { fromJS, isCollection } from "immutable";

import { useI18n } from "../i18n";
import InternalAlert from "../internal-alert";
import { compare } from "../../libs";
import { getRecordFormAlerts } from "../records";
import { getAttachmentForms, getSubformsDisplayName, getValidationErrors } from "../record-form";

import { getMessageData } from "./utils";
import { NAME } from "./constants";

const Component = ({ form, recordType }) => {
  const i18n = useI18n();
  const recordAlerts = useSelector(state => getRecordFormAlerts(state, recordType, form.unique_id), compare);
  const validationErrors = useSelector(state => getValidationErrors(state, form.unique_id), compare);
  const subformDisplayNames = useSelector(state => getSubformsDisplayName(state, i18n.locale), compare);
  const attachmentForms = useSelector(state => getAttachmentForms(state, i18n.locale), compare);

  const errors =
    validationErrors?.size &&
    validationErrors
      .get("errors", fromJS([]))
      .entrySeq()
      .map(([key, value]) => {
        if (isCollection(value)) {
          return fromJS({
            message: i18n.t("error_message.address_subform_fields", {
              subform: subformDisplayNames.get(key) || attachmentForms.get(key),
              fields: value.filter(subform => Boolean(subform)).flatMap(subform => subform.keySeq()).size
            })
          });
        }

        return fromJS({ message: value });
      });

  const items = recordAlerts.map(alert =>
    fromJS({
      message: i18n.t(`messages.alerts_for.${alert.get("alert_for")}`, getMessageData({ alert, form, i18n }))
    })
  );

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
};

Component.displayName = NAME;

Component.propTypes = {
  form: PropTypes.object.isRequired,
  recordType: PropTypes.string.isRequired
};

export default Component;
