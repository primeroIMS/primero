import React from "react";
import { List } from "immutable";
import PropTypes from "prop-types";
import { RECORD_OWNER, TRANSFERS_ASSIGNMENTS } from "config";
import NavGroup from "../NavGroup";
import { NavRecord } from "../../records";

const RecordInformation = ({ open, handleClick }) => {
  const recordInformationForms = List([
    NavRecord({
      group: "record_information",
      groupName: "Record Information",
      groupOrder: 0,
      name: "Record Information",
      order: 0,
      formId: RECORD_OWNER,
      is_first_tab: true
    }),
    // TODO: When transfer_request be implement change the transition_ype
    NavRecord({
      group: "record_information",
      groupName: "Record Information",
      groupOrder: 0,
      name: "Transfers / Assignments",
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
