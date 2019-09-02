/* eslint-disable camelcase */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch } from "@material-ui/core";
import { ListIcon } from "components/list-icon";
import { makeStyles } from "@material-ui/styles";
import { useI18n } from "components/i18n";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as selectors from "./selectors";

const SwitchButton = ({
  recordType,
  props,
  switchButtons,
  setSwitchButton
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const { field_name, options } = props;

  return (
    <div className={css.root}>
      {options.map(v => (
        <div key={v.id} className={css.switchButtonContainer}>
          <span>
            {v.icon ? <ListIcon key={`${v.id}`} icon={v.id} /> : null}
            <span className={css.textSwitchButton}>
              {v.display_name[i18n.locale]}
            </span>
          </span>
          <Switch
            key={v.id}
            checked={switchButtons && switchButtons.includes(v.id.toString())}
            onChange={event => {
              setSwitchButton(
                {
                  field_name,
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

SwitchButton.propTypes = {
  props: PropTypes.object,
  options: PropTypes.object,
  field_name: PropTypes.string,
  recordType: PropTypes.string,
  switchButtons: PropTypes.array,
  setSwitchButton: PropTypes.func
};

const mapStateToProps = (state, obj) => ({
  switchButtons: selectors.selectSwitchButtons(state, obj.props, obj.recordType)
});

const mapDispatchToProps = {
  setSwitchButton: actions.setSwitchValue
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwitchButton);
