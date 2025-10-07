import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { ListItemText, Button, InputAdornment } from "@mui/material";
import { useParams } from "react-router-dom";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { DatePicker } from "@mui/x-date-pickers";

import ActionDialog from "../../../../../../action-dialog";
import ViolationTitle from "../violation-title";
import css from "../../../styles.css";
import { saveRecord } from "../../../../../../records";
import { usePermissions } from "../../../../../../permissions";
import { RECORD_ACTION_ABILITIES } from "../../../../../../record-actions/constants";
import { useI18n } from "../../../../../../i18n";
import { toServerDateFormat } from "../../../../../../../libs";
import DateProvider from "../../../../../../../date-provider";
import { dayOfWeekFormatter } from "../../../../../../../libs/date-picker-localization";

import VerifySelect from "./select";
import { getViolationTallyLabel } from "./utils";
import { NAME } from "./constants";

function Component({ fields, values, locale, displayName, index, collapsedFieldValues, mode }) {
  const currentValues = values[index];
  const verifyParams = useParams();
  const i18n = useI18n();
  const DATE_FORMAT = "dd-MMM-yyyy";

  // State variables
  const dispatch = useDispatch();
  const [verifyModal, setVerifyModal] = useState(false);
  const [verificationValue, setVerificationValue] = useState(currentValues?.ctfmr_verified || "");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    // Changing dropdown select value when backend data updated
    setVerificationValue(currentValues?.ctfmr_verified);
  }, [currentValues?.ctfmr_verified]);

  const handleDropdownDate = date => {
    if (selectedDate) {
      setSelectedDate(date);
    } else {
      setValidationError("date should not be null");
      setSelectedDate(null);
    }
  };

  const handleOpenVerifyModal = (idx, event) => {
    //  To open verify dialog confirmation popup
    event.stopPropagation();
    setVerifyModal(true);
  };

  const cancelVerifyHandler = () => {
    //  To close verify dialog popup
    setVerifyModal(false);
  };

  const { canVerify } = usePermissions("incidents", RECORD_ACTION_ABILITIES); // check permission to verify violations
  const violationTally = getViolationTallyLabel(fields, currentValues, locale);

  const handleOk = () => {
    //  To update the verify status to Verified

    dispatch(
      saveRecord(
        verifyParams.recordType,
        "update",
        {
          data: {
            [currentValues.type]: [
              {
                unique_id: currentValues.unique_id,
                ctfmr_verified: verificationValue,
                ctfmr_verified_date: toServerDateFormat(selectedDate)
              }
            ]
          }
        }, // Save API Call
        verifyParams.id,
        "Updated successfully",
        "",
        false,
        false
      )
    );
    // close();
  };

  // Define VerifySelect component
  const VerifySelectComponent = (
    <VerifySelect selectedValue={verificationValue} setSelectedValue={setVerificationValue} />
  );

  const keyboardDatePickerInputStyles = {
    borderColor: validationError ? "red" : undefined,
    marginLeft: "5px", // Add left margin here
    marginTop: "1em" // Add left margin here
  };

  // Define MuiPickersUtilsProvider component
  const MuiPickersUtilsProviderComponent = (
    <DateProvider>
      <div className={css.keyboardDatePickerWrapper}>
        <DatePicker
          dayOfWeekFormatter={dayOfWeekFormatter(i18n)}
          clearLabel={i18n.t("buttons.clear")}
          cancelLabel={i18n.t("buttons.cancel")}
          okLabel={i18n.t("buttons.ok")}
          InputProps={{
            style: keyboardDatePickerInputStyles,
            endAdornment: (
              <InputAdornment position="end">
                <CalendarTodayIcon />
              </InputAdornment>
            )
          }}
          helperText={i18n.t("fields.date_help")}
          value={selectedDate}
          onChange={handleDropdownDate}
          id="date-picker-inline"
          disableFuture
          format={DATE_FORMAT}
        />
      </div>
    </DateProvider>
  );

  return (
    <ListItemText
      data-testid="violation-item"
      id="subform-header-button"
      classes={{ primary: css.listText, secondary: css.listTextSecondary }}
      secondary={
        <div id="subform-violation-fields">
          {violationTally}
          <br />
          {collapsedFieldValues}
        </div>
      }
    >
      {canVerify && mode.isShow ? (
        <Button
          onClick={event => handleOpenVerifyModal(index, event)}
          id={`verify-button-${index}`}
          className={css.verifiedSpan}
          color="primary"
          variant="contained"
          size="small"
          disableElevation
        >
          {i18n.t("incidents.change_status")}
        </Button>
      ) : null}
      <ViolationTitle title={displayName?.[locale]} values={currentValues} fields={fields} />

      <ActionDialog
        open={verifyModal}
        successHandler={handleOk}
        cancelHandler={cancelVerifyHandler}
        dialogTitle={i18n.t("incidents.change_status")}
        confirmButtonLabel={i18n.t("buttons.update")}
        maxSize="xs"
      >
        {VerifySelectComponent}
        {verificationValue === "verified" ? MuiPickersUtilsProviderComponent : null}
      </ActionDialog>
    </ListItemText>
  );
}

Component.propTypes = {
  collapsedFieldValues: PropTypes.node,
  displayName: PropTypes.object,
  fields: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  locale: PropTypes.string.isRequired,
  mode: PropTypes.object.isRequired,
  values: PropTypes.array.isRequired
};

Component.displayName = NAME;

export default Component;
