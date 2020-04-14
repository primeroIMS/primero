import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

import styles from "../form/styles.css";
import { useI18n } from "../../../../../i18n";

import { NAME } from "./constants";

const Component = ({ hiddenClassName }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  return (
    <div className={clsx(css.row, css.header)}>
      <div className={css.dragIndicatorContainer} />
      <div>{i18n.t("lookup.english_label")}</div>
      <div className={hiddenClassName}>
        {i18n.t("lookup.translation_label")}
      </div>
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  hiddenClassName: PropTypes.string
};

export default Component;
