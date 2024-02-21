import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";

import NepaliCalendar from "../../../nepali-calendar-input";
import { useI18n } from "../../../i18n";
import { LOCALE_KEYS } from "../../../../config";
import css from "../../styles.css";

import { NAME } from "./constants";

const Component = ({ value }) => {
  const i18n = useI18n();

  if (isEmpty(value)) {
    return null;
  }

  if (i18n.locale === LOCALE_KEYS.ne) {
    return (
      <div className={css.readonly}>
        <NepaliCalendar
          dateProps={{
            value,
            disabled: true,
            InputProps: { readOnly: true, autoComplete: "new-password", disableUnderline: true }
          }}
        />
      </div>
    );
  }

  return (
    <div className={css.date} data-testid="dateflag">
      {i18n.localizeDate(value)}
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  value: PropTypes.string
};

export default Component;
