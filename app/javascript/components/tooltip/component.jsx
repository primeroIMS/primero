import React from "react";
import { Tooltip as MuiToolTip } from "@material-ui/core";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/styles/makeStyles";

import { ConditionalWrapper } from "../../libs";
import { useI18n } from "../i18n";

import styles from "./styles.css";

const Tooltip = ({ children, title, i18nTitle }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  const commonTooltipProps = {
    arrow: true,
    classes: {
      arrow: css.arrow,
      tooltip: css.tooltip
    },
    placement: "right-end",
    title: i18nTitle ? i18n.t(title, { defaultValue: "" }) : title
  };

  return (
    <ConditionalWrapper
      condition={Boolean(title)}
      wrapper={MuiToolTip}
      {...commonTooltipProps}
    >
      {children}
    </ConditionalWrapper>
  );
};

Tooltip.displayName = "Tooltip";

Tooltip.defaultProps = {
  i18nTitle: false,
  title: ""
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  i18nTitle: PropTypes.bool,
  title: PropTypes.string
};

export default Tooltip;
