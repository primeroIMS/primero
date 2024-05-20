// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { ConditionalWrapper } from "../../../../libs";
import { DATE_FORMAT, DATE_TIME_FORMAT, LOCALE_KEYS } from "../../../../config";
import { useI18n } from "../../../i18n";
import NepaliCalendar from "../../../nepali-calendar-input";

import css from "./styles.css";

const Component = ({ rowAvailable, wrapper, value, valueWithTime }) => {
  const i18n = useI18n();
  const parsedValue = valueWithTime
    ? i18n.localizeDate(value, DATE_TIME_FORMAT)
    : i18n.localizeDate(value, DATE_FORMAT);

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
};

Component.propTypes = {
  rowAvailable: PropTypes.bool,
  value: PropTypes.any,
  valueWithTime: PropTypes.bool,
  wrapper: PropTypes.node
};

Component.displayName = "DateColumn";

export default Component;
