// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import clsx from "clsx";
import PropTypes from "prop-types";

import PoweredBy from "../../../powered-by";
import TranslationsToggle from "../../../translations-toggle";
import css from "../login-layout/styles.css";

function Component({ useContainedNavStyle = false }) {
  const classes = clsx(css.footer, {
    [css.footerContained]: useContainedNavStyle
  });

  return (
    <div className={classes}>
      <div className={css.item}>
        <TranslationsToggle />
      </div>
      <div className={css.item}>
        <PoweredBy isLogin />
      </div>
    </div>
  );
}

Component.displayName = "LoginLayoutFooter";

Component.propTypes = {
  useContainedNavStyle: PropTypes.bool
};

export default Component;
