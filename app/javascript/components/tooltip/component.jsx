// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Tooltip as MuiToolTip } from "@mui/material";
import PropTypes from "prop-types";

import { ConditionalWrapper } from "../../libs";
import { useI18n } from "../i18n";

import css from "./styles.css";

const Tooltip = ({ children, title, i18nTitle }) => {
  const i18n = useI18n();

  const commonTooltipProps = {
    arrow: true,
    className: css.disabled,
    classes: {
      arrow: css.arrow,
      tooltip: css.tooltip
    },
    placement: "right-end",
    title: i18nTitle ? i18n.t(title, { defaultValue: "" }) : title
  };

  return (
    <ConditionalWrapper condition={Boolean(title)} wrapper={MuiToolTip} {...commonTooltipProps}>
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
