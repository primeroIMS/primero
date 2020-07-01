import React from "react";
import { fromJS } from "immutable";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";

import {
  RECORD_OWNER,
  TRANSFERS_ASSIGNMENTS,
  REFERRAL,
  APPROVALS
} from "../../../../config";
import { SHOW_APPROVALS, checkPermissions } from "../../../../libs/permissions";
import NavGroup from "../NavGroup";
import { NavRecord } from "../../records";
import { useI18n } from "../../../i18n";
import { getPermissionsByRecord } from "../../../user/selectors";

const RecordInformation = ({ open, handleClick, selectedForm, match }) => {
  const { params } = match;
  const { recordType } = params;
  const i18n = useI18n();
  const recordInformationForms = fromJS([
    NavRecord({
      group: "record_information",
      groupName: i18n.t("forms.record_types.record_information"),
      groupOrder: 0,
      name: i18n.t("forms.record_types.record_information"),
      order: 0,
      formId: RECORD_OWNER,
      is_first_tab: true
    }),
    NavRecord({
      group: "record_information",
      groupName: i18n.t("forms.record_types.approvals"),
      groupOrder: 0,
      name: i18n.t("forms.record_types.approvals"),
      order: 1,
      formId: APPROVALS,
      is_first_tab: true,
      permission_actions: SHOW_APPROVALS
    }),
    NavRecord({
      group: "record_information",
      groupName: i18n.t("forms.record_types.referrals"),
      groupOrder: 0,
      name: i18n.t("forms.record_types.referrals"),
      order: 2,
      formId: REFERRAL,
      is_first_tab: true
    }),
    NavRecord({
      group: "record_information",
      groupName: i18n.t("forms.record_types.record_information"),
      groupOrder: 0,
      name: i18n.t("forms.record_types.transfers_assignments"),
      order: 3,
      formId: TRANSFERS_ASSIGNMENTS,
      is_first_tab: false
    })
  ]);

  const userPermissions = useSelector(state =>
    getPermissionsByRecord(state, recordType)
  );
  const forms = recordInformationForms.reduce((acum, form) => {
    if (
      isEmpty(form.permission_actions) ||
      checkPermissions(userPermissions, form.permission_actions)
    ) {
      return acum.push(form);
    }

    return acum;
  }, fromJS([]));

  return (
    <>
      <NavGroup
        group={forms}
        handleClick={handleClick}
        open={open}
        selectedForm={selectedForm}
      />
    </>
  );
};

RecordInformation.displayName = "RecordInformation";

RecordInformation.propTypes = {
  handleClick: PropTypes.func,
  match: PropTypes.object.isRequired,
  open: PropTypes.string,
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default withRouter(RecordInformation);
