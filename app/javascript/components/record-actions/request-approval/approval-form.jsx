import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  IconButton,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Select
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import { useI18n } from "../../i18n";

import { APPROVAL_FORM } from "./constants";
import styles from "./styles.css";

const Component = ({
  approval,
  close,
  handleChangeApproval,
  handleChangeComment,
  handleChangeType,
  requestType,
  selectOptions
}) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  return (
    <>
      <IconButton
        aria-label="close"
        className={css.closeButton}
        onClick={close}
      >
        <CloseIcon />
      </IconButton>
      <form noValidate autoComplete="off">
        <FormControl component="fieldset">
          <FormLabel component="legend">
            {i18n.t("cases.approval_radio")}
          </FormLabel>
          <RadioGroup
            aria-label="position"
            name="position"
            value={approval}
            onChange={handleChangeApproval}
            row
          >
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
        <FormLabel component="legend">
          {i18n.t("cases.approval_select")}
        </FormLabel>
        <Select
          id="outlined-select-approval-native"
          fullWidth
          value={requestType}
          onChange={handleChangeType}
          className={css.selectApprovalType}
        >
          {selectOptions}
        </Select>
        <FormLabel component="legend">
          {i18n.t("cases.approval_comments")}
        </FormLabel>
        <TextField
          id="outlined-multiline-static"
          multiline
          fullWidth
          rows="4"
          defaultValue=""
          variant="outlined"
          onChange={handleChangeComment}
          labelWidth={0}
        />
      </form>
    </>
  );
};

Component.displayName = APPROVAL_FORM;

Component.propTypes = {
  approval: PropTypes.string,
  close: PropTypes.func,
  handleChangeApproval: PropTypes.func,
  handleChangeComment: PropTypes.func,
  handleChangeType: PropTypes.func,
  requestType: PropTypes.string,
  selectOptions: PropTypes.object
};

export default Component;
