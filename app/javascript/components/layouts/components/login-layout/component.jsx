import PropTypes from "prop-types";
import clsx from "clsx";

import ModuleLogo from "../../../module-logo";
import AgencyLogo from "../../../agency-logo";
import TranslationsToggle from "../../../translations-toggle";
import Notifier from "../../../notifier";
import DemoIndicator from "../../../demo-indicator";
import { useMemoizedSelector } from "../../../../libs";
import { useApp } from "../../../application";
import { hasAgencyLogos } from "../../../application/selectors";
import PoweredBy from "../../../powered-by";

import { NAME } from "./constants";
import css from "./styles.css";

const Component = ({ children }) => {
  const { demo, hasLoginLogo } = useApp();
  const hasLogos = useMemoizedSelector(state => hasAgencyLogos(state));

  // TODO: Module hardcoded till we figure out when to switch modules
  const primeroModule = "cp";
  const moduleClass = `${primeroModule}${demo ? "-demo" : ""}`;
  const classes = clsx(css.primeroBackground, css[moduleClass], {
    [css.primeroBackgroundImage]: hasLoginLogo,
    [css.demo]: demo
  });
  const classesLoginLogo = clsx(css.loginLogo, { [css.hideLoginLogo]: !hasLogos });
  const classesAuthDiv = clsx(css.auth, { [css.noLogosWidth]: !hasLogos });

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
          </div>
        </div>
        <div container className={css.footer}>
          <div className={css.item}>
            <TranslationsToggle />
          </div>
          <div className={css.item}>
            <PoweredBy isLogin />
          </div>
        </div>
      </div>
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  children: PropTypes.node
};

export default Component;
