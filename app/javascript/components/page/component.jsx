// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { cx } from "@emotion/css"
import PropTypes from "prop-types";

import useThemeHelper from "../../libs/use-theme-helpers";
import { useApp } from "../application/use-app";

import css from "./styles.css";

function Component({ children, twoCol, fullWidthMobile = false }) {
  const { demo } = useApp();
  const { mobileDisplay } = useThemeHelper();
  const contentClasses = cx({ [css.root]: true, [css.demo]: demo });
  const twoColClasses = cx({ [css.twoCol]: true, [css.demo]: demo });

  const contentContainer = fullWidthMobile && mobileDisplay ? css.noWrap : css.wrap;

  if (twoCol) {
    return <div className={twoColClasses}>{children}</div>;
  }

  return (
    <div className={contentClasses} data-testid="page-container">
      <div className={contentContainer}>{children}</div>
    </div>
  );
}

Component.displayName = "PageContainer";

Component.propTypes = {
  children: PropTypes.node.isRequired,
  fullWidthMobile: PropTypes.bool,
  twoCol: PropTypes.bool
};

export default Component;
