import React, { useState } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  Menu,
  MenuItem,
  IconButton,
  CircularProgress
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { makeStyles } from "@material-ui/styles";

import Permission from "../../../../application/permission";
import { getEnabledAgencies } from "../../../../application/selectors";
import { RESOURCES, REFER_FROM_SERVICE } from "../../../../../libs/permissions";
import {
  getLoadingTransitionType,
  getUsersByTransitionType
} from "../../../../record-actions/transitions/selectors";
import { REFERRAL_TYPE } from "../../../../record-actions/transitions";
import { setServiceToRefer } from "../../../action-creators";
import { getOption } from "../../../selectors";
import { setDialog } from "../../../../record-actions/action-creators";
import { useI18n } from "../../../../i18n";
import { serviceIsReferrable } from "../../utils";
import { fetchReferralUsers } from "../../../../record-actions/transitions/action-creators";
import styles from "../styles.css";
import { RECORD_TYPES } from "../../../../../config";

import { NAME } from "./constants";

const Component = ({ index, recordType, values }) => {
  const i18n = useI18n();
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const css = makeStyles(styles)();

  const services = useSelector(state =>
    getOption(state, "lookup-service-type", i18n.locale)
  );

  const referralUsers = useSelector(state =>
    getUsersByTransitionType(state, REFERRAL_TYPE)
  );

  const loading = useSelector(state =>
    getLoadingTransitionType(state, REFERRAL_TYPE)
  );

  const agencies = useSelector(state => getEnabledAgencies(state));

  const handleClick = event => {
    dispatch(fetchReferralUsers({ record_type: RECORD_TYPES[recordType] }));
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

  const ReferAction = React.forwardRef((props, ref) => (
    <Permission resources={RESOURCES.cases} actions={REFER_FROM_SERVICE}>
      <MenuItem
        key={`refer-option-${index}`}
        onClick={() => handleReferral()}
        ref={ref}
      >
        {values[index].service_status_referred
          ? i18n.t("buttons.referral_again")
          : i18n.t("buttons.referral")}
      </MenuItem>
    </Permission>
  ));

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
          <ReferAction />
        ) : (
          loading && <CircularProgress className={css.loadingIndicator} />
        )}
      </Menu>
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  index: PropTypes.number.isRequired,
  recordType: PropTypes.string,
  values: PropTypes.array.isRequired
};

export default Component;
