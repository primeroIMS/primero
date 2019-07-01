import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { MenuItem, FormControl, Select, InputBase } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useI18n } from "components/i18n";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";

const CustomInput = withStyles(theme => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3)
    }
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 14,
    width: "auto",
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      borderRadius: 3,
      borderColor: "black",
      boxShadow: "inset 0 1px 3px 0 rgba(0, 0, 0, 0.5)"
    }
  }
}))(InputBase);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
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
  const { values } = options;

  return (
    <div className={css.root}>
      <FormControl variant="outlined" className={css.formControl}>
        <Select
          multiple={multiple}
          value={selectValues && selectValues.length > 0 ? selectValues : []}
          onChange={event => {
            setSelectValue({
              id,
              data: event.target.value
            });
          }}
          input={<CustomInput name={id} id={id} />}
          MenuProps={MenuProps}
        >
          {values.map(v => (
            <MenuItem key={v.id} value={v.id}>
              {i18n.t(`${recordType}.filter_by.${v.id}`)}
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
  selectValues: Selectors.getSelect(state, obj.props)
});

const mapDispatchToProps = {
  setSelectValue: actions.setSelectValue
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectFilter);
