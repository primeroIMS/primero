import React, { useState } from "react";
import PropTypes from "prop-types";
import { Menu, MenuItem, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { useI18n } from "../../../../i18n";

import { NAME } from "./constants";

const Component = ({ index, setReferral, values }) => {
  const i18n = useI18n();
  const [anchorEl, setAnchorEl] = useState(null);

  const referralParams = {
    services: values[index].service_type,
    agency: values[index].service_implementing_agency,
    location: values[index].service_delivery_location,
    transitioned_to: values[index].service_implementing_agency_individual,
    service_record_id: values[index].unique_id
  };

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleReferral = () => {
    setReferral(referralParams);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={event => handleClick(event)}
        key={`refer-option-${index}`}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={`service-menu-${index}`}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        key={`service-menu-${index}`}
      >
        <MenuItem
          key={`refer-option-${index}`}
          onClick={() => handleReferral()}
        >
          {values[index].service_status_referred
            ? i18n.t("buttons.referral_again")
            : i18n.t("buttons.referral")}
        </MenuItem>
      </Menu>
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  index: PropTypes.number.isRequired,
  setReferral: PropTypes.func.isRequired,
  values: PropTypes.array.isRequired
};

export default Component;
