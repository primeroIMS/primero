import React from "react";
import PropTypes from "prop-types";
import { connect, useSelector } from "react-redux";
import { Switch } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../../i18n";
import { getOption } from "../../../record-form/selectors";


import styles from "./styles.css";
import * as actions from "./action-creators";
import { selectSwitchButtons } from "./selectors";

const SwitchButton = ({
  recordType,
  props,
  switchButtons,
  setSwitchButton
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const {
    field_name: fieldName,
    options,
    option_strings_source: optionStringsSource
  } = props;
  let values = [];

  values = useSelector(state => getOption(state, optionStringsSource, i18n));

  if (isEmpty(optionStringsSource) && Array.isArray(options)) {
    values = options;
  } else if (Object.keys(values).length <= 0) {
    values = options[i18n.locale];
  }

  return (
    <div className={css.root}>
      {values &&
        values.map(v => (
          <div key={v.id} className={css.switchButtonContainer}>
            <span>
              {v.icon ? <ListIcon key={`${v.id}`} icon={v.id} /> : null}
              <span className={css.textSwitchButton}>
                {v.display_name ||
                  v.display_text ||
                  v.display_name[i18n.locale]}
              </span>
            </span>
            <Switch
              key={v.id}
              checked={switchButtons && switchButtons.includes(v.id.toString())}
              onChange={event => {
                setSwitchButton(
                  {
                    fieldName,
                    included: switchButtons.includes(event.target.value),
                    data: event.target.value
                  },
                  recordType
                );
              }}
              value={v.id}
              color="primary"
            />
          </div>
        ))}
    </div>
  );
};

SwitchButton.displayName = "SwitchButton";

SwitchButton.propTypes = {
  field_name: PropTypes.string,
  option_strings_source: PropTypes.string,
  options: PropTypes.object,
  props: PropTypes.object,
  recordType: PropTypes.string,
  setSwitchButton: PropTypes.func,
  switchButtons: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

const mapStateToProps = (state, obj) => ({
  switchButtons: selectSwitchButtons(state, obj.props, obj.recordType)
});

const mapDispatchToProps = {
  setSwitchButton: actions.setSwitchValue
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwitchButton);
