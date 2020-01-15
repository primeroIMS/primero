import React from "react";
import { List } from "immutable";
import PropTypes from "prop-types";

import {
  RECORD_OWNER,
  TRANSFERS_ASSIGNMENTS,
  REFERRAL,
  APPROVALS
} from "../../../../config";
import NavGroup from "../NavGroup";
import { NavRecord } from "../../records";
import { useI18n } from "../../../i18n";

const RecordInformation = ({ open, handleClick, selectedForm }) => {
  const i18n = useI18n();
  const recordInformationForms = List([
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
      is_first_tab: true
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

  return (
    <>
      <NavGroup
        group={recordInformationForms}
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
  open: PropTypes.object,
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default RecordInformation;
