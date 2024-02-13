import { Box, FormControl, MenuItem, Select } from "@material-ui/core";
import useOptions from "../../../../../../form/use-options";
import { LOOKUPS } from "../../../../../../../config";
import css from "./styles.css"
import PropTypes from "prop-types";

const MENU_PROPS = {
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: 'left'
  },
  transformOrigin: {
    vertical: "top",
    horizontal: 'left'
  }
}

const Component = ({ selectedValue, setSelectedValue }) => {

  const verificationStatus = useOptions({ source: LOOKUPS.verification_status });

  const handleChange = (event) => { // Change dropdown value
    setSelectedValue(event.target.value);
  };

  const onSel = true;

  return (
    <Box className={css.selectWrapper}>
      <FormControl fullWidth classes={{
        root: css.verifyFormControlRoot
      }}>
        <Select
          value={selectedValue}
          onChange={handleChange}
          onSel={onSel}
          MenuProps={MENU_PROPS}
          classes={{
            root: css.verifySelectComponent,
            select: css.verifySelectComponentSelect
          }}
          variant="outlined"
          fullWidth
        >
          {
            verificationStatus.map((option) => (
              <MenuItem key={option.id} value={option.id} style={{ display: option.id === (selectedValue) ? 'none' : 'block' }}>{option.display_text}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
    </Box>
  );
}
Component.propTypes = {
  selectedValue: PropTypes.string,
  setSelectedValue: PropTypes.string
};

Component.displayName = "VerifySelect";

export default Component;
