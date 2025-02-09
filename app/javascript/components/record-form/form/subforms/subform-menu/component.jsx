// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { batch, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { CircularProgress } from "@mui/material";

import { getEnabledAgencies } from "../../../../application/selectors";
import { getLoadingTransitionType, getUsersByTransitionType } from "../../../../record-actions/transitions/selectors";
import { REFERRAL_TYPE } from "../../../../record-actions/transitions";
import { setServiceToRefer } from "../../../action-creators";
import { getOption } from "../../../selectors";
import { setDialog } from "../../../../action-dialog";
import { useI18n } from "../../../../i18n";
import { serviceIsReferrable } from "../../utils";
import css from "../styles.css";
import Permission, { RESOURCES, REFER_FROM_SERVICE } from "../../../../permissions";
import { currentUser } from "../../../../user";
import DisableOffline from "../../../../disable-offline";
import { useMemoizedSelector } from "../../../../../libs";

import ReferAction from "./components/refer-action";
import { NAME } from "./constants";

function Component({ index, values }) {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const services = useMemoizedSelector(state => getOption(state, "lookup-service-type", i18n.locale));
  const referralUsers = useMemoizedSelector(state => getUsersByTransitionType(state, REFERRAL_TYPE));
  const loading = useMemoizedSelector(state => getLoadingTransitionType(state, REFERRAL_TYPE));
  const userName = useMemoizedSelector(state => currentUser(state));
  const agencies = useMemoizedSelector(state => getEnabledAgencies(state));

  const handleReferral = () => {
    batch(() => {
      dispatch(setServiceToRefer({ ...values[index] }));
      dispatch(setDialog({ dialog: REFERRAL_TYPE, open: true }));
    });
  };

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
}

Component.displayName = NAME;

Component.propTypes = {
  index: PropTypes.number.isRequired,
  values: PropTypes.array.isRequired
};

export default Component;
