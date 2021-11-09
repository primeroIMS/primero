import { Button } from "@material-ui/core";
import PropTypes from "prop-types";

import ListIcon from "../../../list-icon";
import { useI18n } from "../../../i18n";

import css from "./styles.css";

const ErrorState = ({ errorMessage, handleTryAgain, type }) => {
  const i18n = useI18n();

  return (
    <div className={css.errorContainer}>
      <div className={css.error}>
        {type && <ListIcon icon={type} className={css.errorIcon} />}
        <h5 className={css.errorMessage}>{errorMessage || i18n.t("errors.error_loading")}</h5>
        <Button
          id="errors.try_again"
          variant="outlined"
          size="small"
          classes={{ root: css.errorButton }}
          onClick={handleTryAgain}
        >
          {i18n.t("errors.try_again")}
        </Button>
      </div>
    </div>
  );
};

ErrorState.displayName = "ErrorState";

ErrorState.propTypes = {
  errorMessage: PropTypes.string,
  handleTryAgain: PropTypes.func.isRequired,
  type: PropTypes.string
};

export default ErrorState;
