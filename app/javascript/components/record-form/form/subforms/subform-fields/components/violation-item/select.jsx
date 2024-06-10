import { Box, FormControl, MenuItem, Select } from "@mui/material";
import PropTypes from "prop-types";

import useOptions from "../../../../../../form/use-options";
import { LOOKUPS } from "../../../../../../../config";

import css from "./styles.css";

const MENU_PROPS = {
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left"
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left"
  }
};

const Component = ({ selectedValue, setSelectedValue }) => {
  const verificationStatus = useOptions({ source: LOOKUPS.verification_status });
  const classesFormCotnrol = { root: css.verifyFormControlRoot };
  const classesSelect = {
    root: css.verifySelectComponent,
    select: css.verifySelectComponentSelect
  };
  const classesMenuItem = option => ({ display: option === selectedValue ? "none" : "block" });

  const handleChange = event => {
    // Change dropdown value
    setSelectedValue(event.target.value);
  };

  const onSel = true;

  return (
    <Box className={css.selectWrapper}>
      <FormControl fullWidth classes={classesFormCotnrol}>
        <Select
          value={selectedValue}
          onChange={handleChange}
          onSel={onSel}
          MenuProps={MENU_PROPS}
          classes={classesSelect}
          variant="outlined"
          fullWidth
        >
          {verificationStatus.map(option => (
            <MenuItem key={option.id} value={option.id} style={classesMenuItem(option.id)}>
              {option.display_text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

Component.propTypes = {
  selectedValue: PropTypes.string,
  setSelectedValue: PropTypes.string
};

Component.displayName = "VerifySelect";

export default Component;
