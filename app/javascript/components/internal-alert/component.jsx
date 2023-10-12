/* eslint-disable react/no-multi-comp, react/display-name */
import PropTypes from "prop-types";
import { fromJS } from "immutable";
import clsx from "clsx";
import { Accordion, AccordionSummary, AccordionDetails, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Brightness1 as Circle } from "@material-ui/icons";
import ErrorIcon from "@material-ui/icons/Error";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SignalWifiOffIcon from "@material-ui/icons/SignalWifiOff";

import { generate } from "../notifier/utils";
import { useI18n } from "../i18n";

import { NAME, SEVERITY } from "./constants";
import { expansionPanelSummaryClasses } from "./theme";
import css from "./styles.css";

const useStylesExpansionPanel = makeStyles(expansionPanelSummaryClasses);

const Component = ({ title, items, severity, customIcon, onDismiss }) => {
  const i18n = useI18n();

  const classes = useStylesExpansionPanel();
  const accordionClasses = clsx(css.alert, css[severity]);
  const accordionDetailsClasses = clsx({ [css.alertItems]: true });
  const accordionSummaryClasses = clsx({
    [css.alertTitle]: true,
    [css.disableCollapse]: items?.size <= 1
  });

  const renderItem = item => {
    return (
      <div className={css.alertItemElement}>
        <span>{item.get("message")}</span>
        { item.get("onDismiss") && renderDismissButton(item.get("onDismiss"))}
      </div>
    );
  };

  const renderItems = () => {
    return (
      items?.size > 1 && (
        <AccordionDetails>
          <ul className={accordionDetailsClasses}>
            {items.map(item => (
              <li key={generate.messageKey()}>{renderItem(item)}</li>
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

  const renderDismissButton = (handler) => {
    return (
        <IconButton className={css.dismissButton} onClick={handler}>
        <CloseIcon />
        </IconButton>
    );
  }

  const renderTitle = () => {
    const titleMessage =
      items?.size > 1 ? title || <div className={css.accordionTitle}>{i18n.t("messages.alert_items", { items: items.size })}</div> : renderItem(items?.first());

    return (
      <>
        <div className={css.icon}>{customIcon || renderIcon()}</div>
        {titleMessage}
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
  severity: "info",
};

Component.propTypes = {
  customIcon: PropTypes.node,
  items: PropTypes.object,
  severity: PropTypes.string,
  title: PropTypes.string,
};

export default Component;
