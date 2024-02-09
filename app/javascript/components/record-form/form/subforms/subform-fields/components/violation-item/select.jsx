import { Box, FormControl, MenuItem, Select } from "@material-ui/core";
import { useEffect, useState } from "react";
import useOptions from "../../../../../../form/use-options";
import { LOOKUPS } from "../../../../../../../config";
import css from "./styles.css"
import PropTypes from "prop-types";

const Component = ({ selectedValue, setSelectedValue }) => {

  const verificationStatus = useOptions({ source: LOOKUPS.verification_status });

  const handleChange = (event) => { // Change dropdown value
    setSelectedValue(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 150 }} >
      <FormControl fullWidth classes={{
        root: css.verifyFormControlRoot
      }}>
        <Select
          value={selectedValue}
          onChange={handleChange}
          onSel
          MenuProps={{
            getContentAnchorEl: null,
            anchorOrigin: {
              vertical: "bottom",
              horizontal: 'left'
            },
            transformOrigin: {
              vertical: "top",
              horizontal: 'left'
            }
          }}
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
