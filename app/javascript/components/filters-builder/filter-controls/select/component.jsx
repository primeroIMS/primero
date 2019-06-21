import React from "react";
import PropTypes from "prop-types";
import { MenuItem, FormControl, Select, InputBase } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import styles from "./styles.css";

const BootstrapInput = withStyles(theme => ({
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

const SelectFilter = ({ multiple, props }) => {
  const css = makeStyles(styles)();
  const [personName, setPersonName] = React.useState([]);
  const { values } = props;
  const handleChange = event => setPersonName(event.target.value);

  return (
    <div className={css.root}>
      <FormControl variant="outlined" className={css.formControl}>
        <Select
          multiple={multiple}
          value={personName}
          onChange={handleChange}
          input={<BootstrapInput name="age" id="age-customized-select" />}
          MenuProps={MenuProps}
        >
          {values.map(v => (
            <MenuItem key={v.id} value={v.id}>
              {v.display_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

SelectFilter.propTypes = {
  multiple: PropTypes.bool,
  props: PropTypes.object,
  values: PropTypes.array
};

export default SelectFilter;
