// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import {
  TextField,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Select,
  FormHelperText
} from "@mui/material";

import { useI18n } from "../../i18n";

import { APPROVAL_FORM } from "./constants";
import css from "./styles.css";

const Component = ({
  approval,
  disabled,
  handleChangeApproval,
  handleChangeComment,
  handleChangeType,
  requestType,
  selectOptions
}) => {
  const i18n = useI18n();

  return (
    <>
      <form noValidate autoComplete="off">
        <div className={css.field}>
          <FormControl component="fieldset">
            <FormLabel component="legend">{i18n.t("cases.approval_radio")}</FormLabel>
            <RadioGroup aria-label="position" name="position" value={approval} onChange={handleChangeApproval} row>
              <FormControlLabel
                value="approved"
                control={<Radio color="primary" />}
                label={i18n.t("cases.approval_radio_accept")}
                labelPlacement="start"
              />
              <FormControlLabel
                value="rejected"
                control={<Radio color="primary" />}
                label={i18n.t("cases.approval_radio_reject")}
                labelPlacement="start"
              />
            </RadioGroup>
          </FormControl>
        </div>
        <div className={css.field}>
          <Select
            variant="outlined"
            id="outlined-select-approval-native"
            fullWidth
            value={requestType}
            onChange={handleChangeType}
            label={i18n.t("cases.approval_select")}
            disabled={disabled}
          >
            {selectOptions}
          </Select>
          {disabled && <FormHelperText>{i18n.t("case.messages.case_no_approval_request")}</FormHelperText>}
        </div>
        <div className={css.field}>
          <TextField
            id="outlined-multiline-static"
            multiline
            fullWidth
            minRows="4"
            defaultValue=""
            variant="outlined"
            onChange={handleChangeComment}
            shrink
            label={i18n.t("cases.approval_comments")}
          />
        </div>
      </form>
    </>
  );
};

Component.displayName = APPROVAL_FORM;

Component.propTypes = {
  approval: PropTypes.string,
  disabled: PropTypes.bool,
  handleChangeApproval: PropTypes.func,
  handleChangeComment: PropTypes.func,
  handleChangeType: PropTypes.func,
  requestType: PropTypes.string,
  selectOptions: PropTypes.object
};

export default Component;
