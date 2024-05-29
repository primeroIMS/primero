// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { useI18n } from "../../i18n";
import { LOCALE_KEYS } from "../../../config";
import NepaliCalendar from "../../nepali-calendar-input";

import css from "./styles.css";

const DateCell = ({ value, withTime }) => {
  const i18n = useI18n();

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

  return <>{i18n.l(`date.formats.${withTime ? "with_time" : "default"}`, value)}</>;
};

DateCell.displayName = "DateCell";

DateCell.propTypes = {
  value: PropTypes.string,
  withTime: PropTypes.bool
};

export default DateCell;
