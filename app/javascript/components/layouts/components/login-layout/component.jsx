import { Grid, Box } from "@material-ui/core";
import PropTypes from "prop-types";
import clsx from "clsx";

import ModuleLogo from "../../../module-logo";
import AgencyLogo from "../../../agency-logo";
import TranslationsToggle from "../../../translations-toggle";
import Notifier from "../../../notifier";
import DemoIndicator from "../../../demo-indicator";
import { useApp } from "../../../application";

import { NAME } from "./constants";
import css from "./styles.css";

const Component = ({ children }) => {
  const { demo } = useApp();

  // TODO: Module hardcoded till we figure out when to switch modules
  const primeroModule = "cp";
  const moduleClass = `${primeroModule}${demo ? "-demo" : ""}`;
  const classes = clsx({ [css.primeroBackground]: true, [css[moduleClass]]: true, [css.demo]: demo });
  const classesLoginLogo = clsx({ [css.loginLogo]: true });
  const classesAuthDiv = clsx({ [css.auth]: true });

  return (
    <>
      <DemoIndicator isDemo={demo} />
      <Notifier />
      <Box className={classes}>
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
        <Grid container className={css.footer}>
          <Grid item xs={2}>
            <TranslationsToggle />
          </Grid>
          <Grid item xs={8} />
        </Grid>
      </Box>
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  children: PropTypes.node
};

export default Component;
