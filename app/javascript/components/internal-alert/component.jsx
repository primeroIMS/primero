/* eslint-disable react/no-multi-comp, react/display-name */
import PropTypes from "prop-types";
import { fromJS } from "immutable";
import clsx from "clsx";
import { Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core";
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

const useStyles = makeStyles(styles);
const useStylesExpansionPanel = makeStyles(expansionPanelSummaryClasses);

const Component = ({ title, items, severity }) => {
  const i18n = useI18n();
  const css = useStyles();
  const classes = useStylesExpansionPanel();
  const accordionClasses = clsx(css.alert, css[severity]);
  const accordionDetailsClasses = clsx({ [css.alertItems]: true });
  const accordionSummaryClasses = clsx({
    [css.alertTitle]: true,
    [css.disableCollapse]: items?.size <= 1
  });

  const renderItems = () => {
    return (
      items?.size > 1 && (
        <AccordionDetails>
          <ul className={accordionDetailsClasses}>
            {items.map(item => (
              <li key={generate.messageKey()}>{item.get("message")}</li>
            ))}
          </ul>
        </AccordionDetails>
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
      items?.size > 1 ? title || i18n.t("messages.alert_items", { items: items.size }) : items?.first()?.get("message");

    return (
      <>
        <div className={css.icon}>{renderIcon()}</div>
        <span className={css.message}>{titleMessage}</span>
      </>
    );
  };

  return (
    <Accordion className={accordionClasses}>
      <AccordionSummary
        classes={classes}
        expandIcon={items?.size > 1 ? <ExpandMoreIcon /> : null}
        aria-controls="record-form-alerts-panel"
        id="record-form-alerts-panel-header"
        className={accordionSummaryClasses}
      >
        {renderTitle()}
      </AccordionSummary>
      {renderItems()}
    </Accordion>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  items: fromJS([]),
  severity: "info"
};

Component.propTypes = {
  items: PropTypes.object,
  severity: PropTypes.string,
  title: PropTypes.string
};

export default Component;
