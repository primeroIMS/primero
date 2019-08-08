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
  const { id, options } = props;
  const { values } = options;

  return (
    <div className={css.root}>
      {values.map(v => (
        <div key={v.id} className={css.switchButtonContainer}>
          <span>
            <ListIcon key={v.id} icon={v.id} />
            <span className={css.textSwitchButton}>
              {i18n.t(`filters.${v.id}`)}
            </span>
          </span>
          <Switch
            key={v.id}
            checked={switchButtons && switchButtons.includes(v.id)}
            onChange={event => {
              setSwitchButton(
                {
                  id,
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
  id: PropTypes.string,
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
