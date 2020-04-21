import React, { useState } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Menu, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { getEnabledAgencies } from "../../../../application/selectors";
import { getUsersByTransitionType } from "../../../../record-actions/transitions/selectors";
import { REFERRAL_TYPE } from "../../../../record-actions/transitions";
import { setServiceToRefer } from "../../../action-creators";
import { getOption } from "../../../selectors";
import { setDialog } from "../../../../record-actions/action-creators";
import { useI18n } from "../../../../i18n";
import { serviceIsReferrable } from "../../utils";

import ReferAction from "./components/refer-action";
import { NAME } from "./constants";

const Component = ({ index, values }) => {
  const i18n = useI18n();
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const services = useSelector(state =>
    getOption(state, "lookup-service-type", i18n.locale)
  );

  const referralUsers = useSelector(state =>
    getUsersByTransitionType(state, REFERRAL_TYPE)
  );

  const agencies = useSelector(state => getEnabledAgencies(state));

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleReferral = () => {
    batch(() => {
      dispatch(setServiceToRefer({ ...values[index] }));
      dispatch(setDialog({ dialog: REFERRAL_TYPE, open: true }));
    });
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const ref = React.createRef();

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
        ref={ref}
      >
        {serviceIsReferrable(
          values[index],
          services,
          agencies,
          referralUsers
        ) ? (
          <ReferAction
            index={index}
            handleReferral={handleReferral}
            values={values}
          />
        ) : null}
      </Menu>
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  index: PropTypes.number.isRequired,
  values: PropTypes.array.isRequired
};

export default Component;
