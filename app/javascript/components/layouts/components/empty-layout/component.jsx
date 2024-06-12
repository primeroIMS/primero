// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/no-multi-comp, react/display-name */
import PropTypes from "prop-types";

import { useApp } from "../../../application";
import DemoIndicator from "../../../demo-indicator";
import SessionTimeoutDialog from "../../../session-timeout-dialog";

const Component = ({ children }) => {
  const { demo } = useApp();

  return (
    <>
      <DemoIndicator isDemo={demo} />
      {children}
      <SessionTimeoutDialog data-testid="session-time-dialog" />
    </>
  );
};

Component.displayName = "EmptyLayout";

Component.propTypes = {
  children: PropTypes.node
};

export default Component;
