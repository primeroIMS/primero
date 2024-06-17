// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { cx } from "@emotion/css"
import { useMediaQuery } from "@mui/material";

import ModuleLogo from "../../../module-logo";
import AgencyLogo from "../../../agency-logo";
import Notifier from "../../../notifier";
import DemoIndicator from "../../../demo-indicator";
import { useMemoizedSelector } from "../../../../libs";
import { useApp } from "../../../application";
import { hasAgencyLogos } from "../../../application/selectors";
import LoginLayoutFooter from "../login-layout-footer";

import { NAME } from "./constants";
import css from "./styles.css";

function Component({ children }) {
  const mobileDisplay = useMediaQuery(theme => theme.breakpoints.down("sm"));
  const { demo, hasLoginLogo, useContainedNavStyle } = useApp();
  const hasLogos = useMemoizedSelector(state => hasAgencyLogos(state));

  const classes = cx(css.primeroBackground, {
    [css.primeroBackgroundImage]: hasLoginLogo,
    [css.primeroBackgroundImageDemo]: hasLoginLogo && demo,
    [css.demoBackground]: demo
  });
  const classesLoginLogo = cx(css.loginLogo, { [css.hideLoginLogo]: !hasLogos });
  const classesAuthDiv = cx(css.auth, { [css.noLogosWidth]: !hasLogos });
  const isContainedAndMobile = useContainedNavStyle && mobileDisplay;

  return (
    <>
      <DemoIndicator isDemo={demo} />
      <Notifier />
      <div className={classes}>
        <div className={css.content}>
          <div className={css.loginHeader}>
            <ModuleLogo white />
          </div>
          <div className={css.authContainer}>
            <div className={classesAuthDiv}>
              <div className={css.formContainer}>
                <div className={css.form}>{children}</div>
              </div>
              <div className={classesLoginLogo}>
                <AgencyLogo alwaysFullLogo />
              </div>
            </div>
            {isContainedAndMobile && <LoginLayoutFooter useContainedNavStyle />}
          </div>
        </div>
        {isContainedAndMobile || <LoginLayoutFooter />}
      </div>
    </>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  children: PropTypes.node
};

export default Component;
