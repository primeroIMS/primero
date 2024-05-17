// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";

import NepaliCalendar from "../../../nepali-calendar-input";
import DisplayData from "../../../display-data";
import { useI18n } from "../../../i18n";
import { DATE_TIME_FORMAT, LOCALE_KEYS } from "../../../../config";
import css from "../../styles.css";

import { NAME } from "./constants";

const Component = ({ name, label, value }) => {
  const i18n = useI18n();

  if (isEmpty(value)) {
    return null;
  }

  if (i18n.locale === LOCALE_KEYS.ne) {
    return (
      <div className={css.readonly}>
        <NepaliCalendar
          label={i18n.t(label)}
          dateProps={{
            value,
            name,
            disabled: true,
            InputProps: { readOnly: true, autoComplete: "new-password", disableUnderline: true }
          }}
        />
      </div>
    );
  }

  return <DisplayData label={label} value={i18n.localizeDate(value, DATE_TIME_FORMAT)} />;
};

Component.displayName = NAME;

Component.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string
};

export default Component;
