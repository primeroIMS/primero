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
      <SessionTimeoutDialog />
    </>
  );
};

Component.displayName = "EmptyLayout";

Component.propTypes = {
  children: PropTypes.node
};

export default Component;
