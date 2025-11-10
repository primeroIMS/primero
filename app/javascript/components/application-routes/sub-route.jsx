// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

import ErrorBoundary from "../error-boundary";
import { PERMITTED_URL } from "../../config";
import useMemoizedSelector from "../../libs/use-memoized-selector";
import Permission from "../permissions";
import { getCodeOfConductEnabled, getCodesOfConduct } from "../application/selectors";
import {
  getCodeOfConductId,
  getUserAgencyTermsOfUseEnabled,
  getUserAgencyTermsOfUseChanged,
  getUserTermsOfUseAcceptedOn
} from "../user";

import { getPathToRedirect } from "./utils";

function SubRoute({ subRoute }) {
  const { path, resources, actions, component: Component, extraProps } = subRoute;

  const codeOfConductAccepted = useMemoizedSelector(state => getCodeOfConductId(state));
  const codeOfConductEnabled = useMemoizedSelector(state => getCodeOfConductEnabled(state));
  const codeOfConduct = useMemoizedSelector(state => getCodesOfConduct(state));

  const agencyTermsOfUseEnabled = useMemoizedSelector(state => getUserAgencyTermsOfUseEnabled(state));
  const agencyTermsOfUseAcceptedChanged = useMemoizedSelector(state => getUserAgencyTermsOfUseChanged(state));
  const termsOfUseAcceptedOn = useMemoizedSelector(state => getUserTermsOfUseAcceptedOn(state));

  const pathToRedirect = getPathToRedirect({
    agencyTermsOfUseEnabled,
    agencyTermsOfUseAcceptedChanged,
    termsOfUseAcceptedOn,
    path,
    codeOfConductEnabled,
    codeOfConductAccepted,
    codeOfConduct
  });

  if (pathToRedirect) {
    return <Redirect to={{ pathname: pathToRedirect, state: { referrer: path } }} />;
  }

  return PERMITTED_URL.includes(path) ? (
    <ErrorBoundary>
      <Component {...extraProps} />
    </ErrorBoundary>
  ) : (
    <ErrorBoundary>
      <Permission resources={resources} actions={actions} redirect>
        <Component {...extraProps} />
      </Permission>
    </ErrorBoundary>
  );
}

SubRoute.displayName = "SubRoute";

SubRoute.propTypes = {
  subRoute: PropTypes.object.isRequired
};

export default SubRoute;
