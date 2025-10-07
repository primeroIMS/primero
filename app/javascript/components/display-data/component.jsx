// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { useI18n } from "../i18n";

import { NAME } from "./constants";
import css from "./styles.css";

function DisplayData({ label, value, noTranslate = false }) {
  const i18n = useI18n();

  return (
    <div className={css.data} data-testid="display-data">
      <div className={css.label}>{noTranslate ? label : i18n.t(label)}</div>
      <div className={css.value}>{value || "--"}</div>
    </div>
  );
}

DisplayData.displayName = NAME;

DisplayData.propTypes = {
  label: PropTypes.string.isRequired,
  noTranslate: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node])
};

export default DisplayData;
