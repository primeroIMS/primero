import React from "react";
import { useI18n } from "components/i18n";
import { List } from "immutable";
import PropTypes from "prop-types";
import {
  RECORD_OWNER,
  TRANSFERS_ASSIGNMENTS,
  REFERRAL
} from "../../../../config";
import NavGroup from "../NavGroup";
import { NavRecord } from "../../records";

const RecordInformation = ({ open, handleClick }) => {
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
      groupName: i18n.t("forms.record_types.referrals"),
      groupOrder: 0,
      name: i18n.t("forms.record_types.referrals"),
      order: 1,
      formId: REFERRAL,
      is_first_tab: true
    }),
    // TODO: When transfer_request be implement change the transition_ype
    NavRecord({
      group: "record_information",
      groupName: i18n.t("forms.record_types.record_information"),
      groupOrder: 0,
      name: i18n.t("forms.record_types.transfers_assignments"),
      order: 2,
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
        selectedForm=""
      />
    </>
  );
};

RecordInformation.propTypes = {
  open: PropTypes.object,
  handleClick: PropTypes.func
};

export default RecordInformation;
