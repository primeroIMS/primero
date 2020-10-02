import React, { useEffect } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { CircularProgress } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { getEnabledAgencies } from "../../../../application/selectors";
import { getLoadingTransitionType, getUsersByTransitionType } from "../../../../record-actions/transitions/selectors";
import { REFERRAL_TYPE } from "../../../../record-actions/transitions";
import { setServiceToRefer } from "../../../action-creators";
import { getOption } from "../../../selectors";
import { setDialog } from "../../../../record-actions/action-creators";
import { useI18n } from "../../../../i18n";
import { serviceIsReferrable } from "../../utils";
import { fetchReferralUsers } from "../../../../record-actions/transitions/action-creators";
import styles from "../styles.css";
import { RECORD_TYPES } from "../../../../../config";
import Permission from "../../../../application/permission";
import { RESOURCES, REFER_FROM_SERVICE } from "../../../../../libs/permissions";
import { currentUser } from "../../../../user";
import DisableOffline from "../../../../disable-offline";

import ReferAction from "./components/refer-action";
import { NAME } from "./constants";

const Component = ({ index, recordType, values }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const css = makeStyles(styles)();

  const services = useSelector(state => getOption(state, "lookup-service-type", i18n.locale));

  const referralUsers = useSelector(state => getUsersByTransitionType(state, REFERRAL_TYPE));

  const loading = useSelector(state => getLoadingTransitionType(state, REFERRAL_TYPE));

  const userName = useSelector(state => currentUser(state));

  const agencies = useSelector(state => getEnabledAgencies(state));

  const handleReferral = () => {
    batch(() => {
      dispatch(setServiceToRefer({ ...values[index] }));
      dispatch(setDialog({ dialog: REFERRAL_TYPE, open: true }));
    });
  };

  useEffect(() => {
    dispatch(fetchReferralUsers({ record_type: RECORD_TYPES[recordType] }));
  }, []);

  const {
    service_implementing_agency_individual: serviceImplementingAgencyIndividual,
    service_external_referral: serviceExternalReferral
  } = values[index];

  if (userName === serviceImplementingAgencyIndividual && !serviceExternalReferral) {
    return null;
  }

  return (
    <DisableOffline>
      <Permission resources={RESOURCES.cases} actions={REFER_FROM_SERVICE}>
        {serviceIsReferrable(values[index], services, agencies, referralUsers) ? (
          <ReferAction index={index} handleReferral={handleReferral} values={values} />
        ) : (
          loading && <CircularProgress className={css.loadingIndicator} />
        )}
      </Permission>
    </DisableOffline>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  index: PropTypes.number.isRequired,
  recordType: PropTypes.string,
  values: PropTypes.array.isRequired
};

export default Component;
