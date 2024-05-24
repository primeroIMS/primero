// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/no-multi-comp, react/display-name */
import PropTypes from "prop-types";
import { FormHelperText } from "@material-ui/core";

import { SEPERATOR_NAME } from "../constants";
import css from "../styles.css";

const Seperator = ({ helperText, label, mode }) => {
  return (
    <div className={css.seperator}>
      <div className={css.separatorTitle}>
        <h4>{label}</h4>
      </div>
      {(mode.isEdit || mode.isNew) && helperText && <FormHelperText>{helperText}</FormHelperText>}
    </div>
  );
};

Seperator.displayName = SEPERATOR_NAME;

Seperator.propTypes = {
  helperText: PropTypes.string,
  label: PropTypes.string,
  mode: PropTypes.object
};

export default Seperator;
