import PropTypes from "prop-types";

import { ConditionalWrapper } from "../../../../libs";
import { LOCALE_KEYS } from "../../../../config";
import { useI18n } from "../../../i18n";
import NepaliCalendar from "../../../nepali-calendar-input";
import { selectedDateFormat } from "../../../../libs/date-picker-localization";

import css from "./styles.css";

function Component({ rowAvailable, wrapper, value, valueWithTime }) {
  const i18n = useI18n();
  const parsedValue = valueWithTime
    ? i18n.localizeDate(value, selectedDateFormat(true, i18n.locale))
    : i18n.localizeDate(value, selectedDateFormat(false, i18n.locale));

  const children =
    i18n.locale === LOCALE_KEYS.ne ? (
      <div className={css.readonly} data-testid="nepali-calendar">
        <NepaliCalendar
          dateProps={{
            value,
            disabled: true,
            dateIncludeTime: valueWithTime,
            InputProps: { readOnly: true, autoComplete: "new-password", disableUnderline: true }
          }}
        />
      </div>
    ) : (
      <span data-testid="parsed-date">{parsedValue || ""}</span>
    );

  return (
    <ConditionalWrapper
      condition={!rowAvailable}
      wrapper={wrapper}
      offlineTextKey="unavailable_offline"
      overrideCondition={!rowAvailable}
    >
      {children}
    </ConditionalWrapper>
  );
}

Component.propTypes = {
  rowAvailable: PropTypes.bool,
  value: PropTypes.any,
  valueWithTime: PropTypes.bool,
  wrapper: PropTypes.node
};

Component.displayName = "DateColumn";

export default Component;
