import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import ErrorIcon from "@material-ui/icons/Error";

import styles from "../styles.css";

import { NAME } from "./constants";

const useStyles = makeStyles(styles);

const Component = ({ i18n, subformName }) => {
  const css = useStyles();

  return (
    <div className={css.emptySubformContainer}>
      <ErrorIcon />
      <span>
        <strong>{i18n.t("forms.subform_not_found", { subform_name: subformName })}</strong>
        {i18n.t("forms.subform_need_to_be_added")}
      </span>
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  i18n: PropTypes.object.isRequired,
  subformName: PropTypes.string
};

export default Component;
