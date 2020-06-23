/* eslint-disable react/no-multi-comp, react/display-name */
import React from "react";
import PropTypes from "prop-types";
import { fromJS } from "immutable";
import clsx from "clsx";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Brightness1 as Circle } from "@material-ui/icons";
import ErrorIcon from "@material-ui/icons/Error";
import CheckIcon from "@material-ui/icons/Check";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SignalWifiOffIcon from "@material-ui/icons/SignalWifiOff";

import { generate } from "../notifier/utils";
import { useI18n } from "../i18n";

import { NAME, SEVERITY } from "./constants";
import { expansionPanelSummaryClasses } from "./theme";
import styles from "./styles.css";

const Component = ({ items, severity }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const classes = makeStyles(expansionPanelSummaryClasses)();

  const renderItems = () => {
    return (
      items?.size > 1 && (
        <ExpansionPanelDetails>
          <ul className={clsx({ [css.alertItems]: true })}>
            {items.map(item => (
              <li key={generate.messageKey()}>{item.get("message")}</li>
            ))}
          </ul>
        </ExpansionPanelDetails>
      )
    );
  };

  const renderIcon = () => {
    switch (severity) {
      case SEVERITY.error:
        return <ErrorIcon />;
      case SEVERITY.success:
        return <CheckIcon />;
      case SEVERITY.warning:
        return <SignalWifiOffIcon />;
      default:
        return <Circle />;
    }
  };

  const renderTitle = () => {
    const titleMessage =
      items?.size > 1
        ? i18n.t("messages.alert_items", { items: items.size })
        : items?.first()?.get("message");

    return (
      <>
        <div className={css.icon}>{renderIcon()}</div>
        <span className={css.message}>{titleMessage}</span>
      </>
    );
  };

  return (
    <ExpansionPanel className={clsx(css.alert, css[severity])}>
      <ExpansionPanelSummary
        classes={classes}
        expandIcon={items?.size > 1 ? <ExpandMoreIcon /> : null}
        aria-controls="record-form-alerts-panel"
        id="record-form-alerts-panel-header"
        className={clsx({
          [css.alertTitle]: true,
          [css.disableCollapse]: items?.size <= 1
        })}
      >
        {renderTitle()}
      </ExpansionPanelSummary>
      {renderItems()}
    </ExpansionPanel>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  items: fromJS([]),
  severity: "info"
};

Component.propTypes = {
  items: PropTypes.object,
  severity: PropTypes.string
};

export default Component;
