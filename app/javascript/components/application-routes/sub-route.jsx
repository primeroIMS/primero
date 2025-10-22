// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

import ErrorBoundary from "../error-boundary";
import { PERMITTED_URL, ROUTES } from "../../config";
import useMemoizedSelector from "../../libs/use-memoized-selector";
import Permission from "../permissions";
import { getCodeOfConductEnabled, getCodesOfConduct } from "../application/selectors";
import { getCodeOfConductId, getIsIdentifiedUser } from "../user";

function SubRoute({ subRoute }) {
  const { path, resources, actions, component: Component, extraProps } = subRoute;

  const codeOfConductAccepted = useMemoizedSelector(state => getCodeOfConductId(state));
  const codeOfConductEnabled = useMemoizedSelector(state => getCodeOfConductEnabled(state));
  const codeOfConduct = useMemoizedSelector(state => getCodesOfConduct(state));
  const isIdentifiedUser = useMemoizedSelector(state => getIsIdentifiedUser(state));

  if (
    codeOfConductEnabled &&
    !codeOfConductAccepted &&
    !isEmpty(codeOfConduct) &&
    ![ROUTES.logout, ROUTES.login, ROUTES.code_of_conduct].includes(path)
  ) {
    return <Redirect to={{ pathname: ROUTES.code_of_conduct, state: { referrer: path } }} />;
  }

  if (isIdentifiedUser && ROUTES.dashboard === path) {
    return <Redirect to={{ pathname: ROUTES.my_case, state: { referrer: path } }} />;
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
