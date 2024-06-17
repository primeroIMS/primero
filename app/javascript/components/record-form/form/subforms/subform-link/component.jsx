// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { cx } from "@emotion/css"

import { useI18n } from "../../../../i18n";
import ConditionalTooltip from "../../../../conditional-tooltip";

import css from "./styles.css";

function Component({ href, label, text, disabled = false }) {
  const i18n = useI18n();
  const classes = cx({
    [css.subformLink]: true,
    [css.subformLinkDisabled]: disabled
  });

  const classesWrapper = cx({
    [css.subformLinkWrapper]: true,
    [css.subformLinkWrapperDisabled]: disabled
  });

  return (
    <div className={classesWrapper}>
      <div className={css.subformLinkLabel}>{label}</div>
      <ConditionalTooltip condition={disabled} title={i18n.t("cases.access_denied")}>
        <NavLink to={href} className={classes}>
          {text}
        </NavLink>
      </ConditionalTooltip>
    </div>
  );
}

Component.displayName = "SubformLink";

Component.propTypes = {
  disabled: PropTypes.bool,
  href: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

export default Component;
