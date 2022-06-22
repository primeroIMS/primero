import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import { TALLY_FIELD_CONTAINER_NAME } from "../constants";
import { displayNameHelper } from "../../../../libs";
import { NUMERIC_FIELD } from "../../constants";
import css from "../styles.css";

import TextField from "./text-field";

const TallyFieldContainer = ({ name, option, isTotal, ...rest }) => {
  const i18n = useI18n();

  if (!isTotal && !option) {
    return null;
  }

  const label = isTotal ? i18n.t("fields.total") : displayNameHelper(option.display_text, i18n.locale);

  const fieldProps = {
    name,
    field: { type: NUMERIC_FIELD },
    label,
    variant: "outlined",
    autoComplete: "off",
    fullWidth: false,
    inputProps: { min: 0 },
    InputLabelProps: {
      shrink: true,
      classes: {
        root: css.tallyInputLabel
      }
    },
    ...{ ...rest, disabled: isTotal }
  };

  return <TextField {...fieldProps} />;
};

TallyFieldContainer.displayName = TALLY_FIELD_CONTAINER_NAME;

TallyFieldContainer.propTypes = {
  isTotal: PropTypes.bool,
  name: PropTypes.string,
  option: PropTypes.object
};

export default TallyFieldContainer;
