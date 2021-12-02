import PropTypes from "prop-types";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import ActionButton from "../../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../../action-button/constants";

import { NAME } from "./constants";
import css from "./styles.css";

const Component = ({ handleBack }) => {
  return (
    <div className={css.buttonsRow}>
      {handleBack && (
        <ActionButton
          icon={<ArrowBackIosIcon />}
          text="incident.violation.back_to_violations"
          type={ACTION_BUTTON_TYPES.default}
          outlined
          rest={{
            onClick: handleBack
          }}
        />
      )}
    </div>
  );
};

Component.propTypes = {
  handleBack: PropTypes.func
};

Component.displayName = NAME;

export default Component;
