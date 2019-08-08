import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { MenuItem, FormControl, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useI18n } from "components/i18n";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224
    }
  }
};

const SelectFilter = ({
  recordType,
  multiple,
  props,
  selectValues,
  setSelectValue
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const { id, options } = props;
  const { values, defaultValue } = options;

  return (
    <div className={css.root}>
      <FormControl variant="outlined" className={css.formControl}>
        <Select
          multiple={multiple}
          value={selectValues && selectValues.length > 0 ? selectValues : []}
          onChange={event => {
            setSelectValue(
              {
                id,
                data: event.target.value,
                defaultValue
              },
              recordType
            );
          }}
          MenuProps={MenuProps}
        >
          {values.map(v => (
            <MenuItem key={v.id} value={v.id}>
              {i18n.t(`filters.${v.id}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

SelectFilter.propTypes = {
  recordType: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  props: PropTypes.object,
  options: PropTypes.object,
  id: PropTypes.string,
  selectValues: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  setSelectValue: PropTypes.func
};

const mapStateToProps = (state, obj) => ({
  selectValues: Selectors.getSelect(state, obj.props, obj.recordType)
});

const mapDispatchToProps = {
  setSelectValue: actions.setSelectValue
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectFilter);
