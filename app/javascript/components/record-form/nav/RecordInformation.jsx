import React from "react";
import { List } from "immutable";
import Divider from "@material-ui/core/Divider";
import PropTypes from "prop-types";
import NavGroup from "./NavGroup";
import { NavRecord } from "../records";

const RecordInformation = ({ open, handleClick }) => {
  const recordInformationForms = List([
    NavRecord({
      group: "record_information",
      groupName: "Record Information",
      groupOrder: 0,
      name: "Record Information",
      order: 0,
      formId: "record_owner",
      is_first_tab: true
    }),
    // TODO: When transfer_request be implement change the transition_ype
    NavRecord({
      group: "record_information",
      groupName: "Record Information",
      groupOrder: 0,
      name: "Transfers / Assignments",
      order: 2,
      formId: "transfers_assignments",
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
      <Divider />
    </>
  );
};

RecordInformation.propTypes = {
  open: PropTypes.object,
  handleClick: PropTypes.func
};

export default RecordInformation;
