// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import clsx from "clsx";
import { useMediaQuery } from "@material-ui/core";

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

const Component = ({ children }) => {
  const mobileDisplay = useMediaQuery(theme => theme.breakpoints.down("sm"));
  const { demo, hasLoginLogo, useContainedNavStyle } = useApp();
  const hasLogos = useMemoizedSelector(state => hasAgencyLogos(state));

  // TODO: Module hardcoded till we figure out when to switch modules
  const primeroModule = "cp";
  const moduleClass = `${primeroModule}${demo ? "-demo" : ""}`;
  const classes = clsx(css.primeroBackground, css[moduleClass], {
    [css.primeroBackgroundImage]: hasLoginLogo
  });
  const classesLoginLogo = clsx(css.loginLogo, { [css.hideLoginLogo]: !hasLogos });
  const classesAuthDiv = clsx(css.auth, { [css.noLogosWidth]: !hasLogos });
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
};

Component.displayName = NAME;

Component.propTypes = {
  children: PropTypes.node
};

export default Component;
