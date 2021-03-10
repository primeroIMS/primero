import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import styles from "../styles.css";
import { useI18n } from "../../../../../i18n";

import { NAME } from "./constants";

const useStyles = makeStyles(styles);

const Component = ({ hideTranslationColumn }) => {
  const i18n = useI18n();
  const css = useStyles();
  const hide = hideTranslationColumn ? css.hideTranslationsFields : null;
  const classes = clsx(css.row, css.header);

  return (
    <div className={classes}>
      <div className={css.dragIndicatorContainer} />
      <div>{i18n.t("lookup.english_label")}</div>
      <div className={hide}>{i18n.t("lookup.translation_label")}</div>
      <div className={css.dragIndicatorContainer}>{i18n.t("lookup.enabled_label")}</div>
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  hideTranslationColumn: PropTypes.bool
};

export default Component;
