import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  MenuItem,
  IconButton,
  CircularProgress
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { makeStyles } from "@material-ui/styles";

import styles from "../../../styles.css";
import { getOption } from "../../../selectors";
import { useI18n } from "../../../../i18n";
import { getLoading } from "../../../../index-table";
import {
  selectAgencies,
  getAgenciesWithService
} from "../../../../application/selectors";
import { getUsersByTransitionType } from "../../../../record-actions/transitions/selectors";
import { fetchReferralUsers } from "../../../../record-actions/transitions/action-creators";

import { NAME, LOOKUP_SERVICE_TYPE } from "./constants";

const Component = ({ index, setReferral, values }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const referralParams = {
    services: values[index].service_type,
    agency: values[index].service_implementing_agency,
    location: values[index].service_delivery_location,
    transitioned_to: values[index].service_implementing_agency_individual,
    service_record_id: values[index].unique_id
  };

  const services = useSelector(state =>
    getOption(state, LOOKUP_SERVICE_TYPE, i18n.locale)
  );

  const agencies = useSelector(
    state =>
      referralParams.services
        ? getAgenciesWithService(state, referralParams.services)
        : selectAgencies(state),
    (agencies1, agencies2) => agencies1.equals(agencies2)
  );

  const referralUsers = useSelector(
    state => getUsersByTransitionType(state, "referral"),
    (users1, users2) => users1.equals(users2)
  );

  const NAMESPACE = ["transitions", "referral"];

  const loading = useSelector(state => getLoading(state, NAMESPACE));

  const loadReferralUsers = () => {
    const filters = Object.entries({
      services: referralParams.services
    }).reduce((acc, entry) => {
      return entry[1] ? { ...acc, [entry[0]]: entry[1] } : acc;
    }, {});

    dispatch(
      fetchReferralUsers({
        record_type: "case",
        ...filters
      })
    );
  };

  const isServiceAvailable = () =>
    Boolean(services.find(service => service.id === referralParams.services));

  const isAgencyAvailable = () =>
    Boolean(
      agencies.find(
        agency =>
          referralParams.agency === agency.get("unique_id") &&
          agency.get("disabled") === false
      )
    );

  const isUserAvailable = () =>
    Boolean(
      referralUsers.find(
        user =>
          user.get("user_name") === referralParams.transitioned_to &&
          user.get("disabled") === false
      )
    );

  const isDisabled = () =>
    (referralParams.services && !isServiceAvailable()) ||
    (referralParams.agency && !isAgencyAvailable()) ||
    (referralUsers?.size && !isUserAvailable());

  const handleClick = event => {
    loadReferralUsers();
    setAnchorEl(event.currentTarget);
  };

  const handleReferral = () => {
    setReferral(referralParams);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderCircularProgress = loading && (
    <CircularProgress size={24} value={25} className={css.loadingMargin} />
  );

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
          disabled={isDisabled() || loading}
        >
          {renderCircularProgress}
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
