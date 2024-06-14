// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/no-multi-comp, react/display-name */
import PropTypes from "prop-types";
import { fromJS } from "immutable";
import clsx from "clsx";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { Brightness1 as Circle } from "@mui/icons-material";
import ErrorIcon from "@mui/icons-material/Error";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SignalWifiOffIcon from "@mui/icons-material/SignalWifiOff";

import { generate } from "../notifier/utils";
import { useI18n } from "../i18n";

import InternalAlertItem from "./components/item";
import { NAME, SEVERITY } from "./constants";
import css from "./styles.css";

const Component = ({ title, items, severity, customIcon }) => {
  const i18n = useI18n();

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
              <li key={generate.messageKey()}>
                <InternalAlertItem item={item} />
              </li>
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
      items?.size > 1 ? (
        title || <div className={css.accordionTitle}>{i18n.t("messages.alert_items", { items: items.size })}</div>
      ) : (
        <InternalAlertItem item={items.first()} />
      );

    return (
      <>
        <div className={css.icon}>{customIcon || renderIcon()}</div>
        <span className={css.message} data-testid="internal-alert-message">
          {titleMessage}
        </span>
      </>
    );
  };

  return (
    <Accordion className={accordionClasses}>
      <AccordionSummary
        data-testid="internal-alert"
        classes={{ expanded: css.expanded, content: css.content }}
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
  customIcon: PropTypes.node,
  items: PropTypes.object,
  severity: PropTypes.string,
  title: PropTypes.string
};

export default Component;
