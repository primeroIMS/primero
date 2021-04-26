import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Accordion, AccordionSummary, AccordionDetails, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import isEmpty from "lodash/isEmpty";

import { RefreshIcon } from "../../../images/primero-icons";
import { useI18n } from "../../i18n";
import { buildNameFilter } from "../utils";
import { useApp } from "../../application";
import { useThemeHelper } from "../../../libs";

import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Panel = ({ filter, getValues, selectedDefaultValueField, handleReset, moreSectionFilters, children }) => {
  const css = useStyles();
  const { isRTL } = useThemeHelper();
  const { name, field_name: fieldName } = filter;

  const hasValue = !isEmpty(getValues()?.[selectedDefaultValueField || fieldName]);
  const i18n = useI18n();
  const { approvalsLabels } = useApp();
  const [open, setOpen] = useState(false);

  const handleChange = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setOpen(hasValue);
  }, [hasValue]);

  const expanded = open || Object.keys(moreSectionFilters).includes(selectedDefaultValueField || fieldName);

  const filterLabel = buildNameFilter(name, i18n, approvalsLabels);

  return (
    <Accordion className={css.panel} elevation={3} expanded={expanded} onChange={handleChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div className={css.heading}>
          <div className={css.panelTitle}>{filterLabel}</div>
          {handleReset && (
            <IconButton
              aria-label={i18n.t("buttons.delete")}
              justifycontent="flex-end"
              size="small"
              onClick={handleReset}
            >
              <RefreshIcon className={isRTL ? css.flipImage : ""} />
            </IconButton>
          )}
        </div>
      </AccordionSummary>
      <AccordionDetails className={css.panelDetails}>{children}</AccordionDetails>
    </Accordion>
  );
};

Panel.defaultProps = {
  moreSectionFilters: {}
};

Panel.displayName = "Panel";

Panel.propTypes = {
  children: PropTypes.node.isRequired,
  filter: PropTypes.object.isRequired,
  getValues: PropTypes.func.isRequired,
  handleReset: PropTypes.func,
  moreSectionFilters: PropTypes.object,
  selectedDefaultValueField: PropTypes.string
};

export default Panel;
