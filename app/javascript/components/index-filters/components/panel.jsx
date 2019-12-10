import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  IconButton
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import isEmpty from "lodash/isEmpty";

import { RefreshIcon } from "../../../images/primero-icons";
import { useI18n } from "../../i18n";

import styles from "./styles.css";

const Panel = ({
  filter,
  getValues,
  selectedDefaultValueField,
  handleReset,
  children
}) => {
  const css = makeStyles(styles)();
  const { name, field_name: fieldName } = filter;
  const hasValue = !isEmpty(
    getValues()?.[selectedDefaultValueField || fieldName]
  );
  const i18n = useI18n();
  const [open, setOpen] = useState(false);

  const handleChange = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setOpen(hasValue);
  }, [hasValue]);

  return (
    <ExpansionPanel
      className={css.panel}
      elevation={3}
      expanded={open}
      onChange={handleChange}
    >
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <div className={css.heading}>
          <div className={css.panelTitle}>{i18n.t(name)}</div>
          {handleReset && (
            <IconButton
              aria-label={i18n.t("buttons.delete")}
              justifycontent="flex-end"
              size="small"
              onClick={handleReset}
            >
              <RefreshIcon />
            </IconButton>
          )}
        </div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={css.panelDetails}>
        {children}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

Panel.displayName = "Panel";

Panel.propTypes = {
  children: PropTypes.node.isRequired,
  filter: PropTypes.object.isRequired,
  getValues: PropTypes.func.isRequired,
  handleReset: PropTypes.func,
  selectedDefaultValueField: PropTypes.string
};

export default Panel;
