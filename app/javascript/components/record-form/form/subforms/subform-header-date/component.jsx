import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../../../i18n";
import { SUBFORM_HEADER_DATE } from "../constants";
import { LOCALE_KEYS } from "../../../../../config";
import NepaliCalendar from "../../../../nepali-calendar-input";
import { selectedDateFormat } from "../../../../../libs/date-picker-localization";

import css from "./styles.css";

function Component({ value, includeTime }) {
  const i18n = useI18n();

  if (isEmpty(value)) return value || "";

  const dateFormat = selectedDateFormat(includeTime, i18n.locale);
  const dateValue = i18n.localizeDate(value, dateFormat);

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

  return <span data-testid="date-header">{dateValue}</span>;
}

Component.displayName = SUBFORM_HEADER_DATE;

Component.propTypes = {
  includeTime: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])
};

export default Component;
