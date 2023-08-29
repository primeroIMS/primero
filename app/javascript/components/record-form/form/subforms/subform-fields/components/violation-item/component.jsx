import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { ListItemText } from "@material-ui/core";
import ActionDialog from "../../../../../../action-dialog";

import ViolationTitle from "../violation-title";
import css from "../../../styles.css";

import { NAME } from "./constants";
import { getViolationTallyLabel } from "./utils";

import { Button } from "@material-ui/core";
import { saveRecord } from "../../../../../../records";
import { useParams} from 'react-router-dom';
import { usePermissions } from "../../../../../../permissions";
import { RECORD_ACTION_ABILITIES } from "../../../../../../record-actions/constants";
import VerifySelect from "./select";
import { useI18n } from "../../../../../../i18n";
import { toServerDateFormat } from "../../../../../../../libs";

const Component = ({ fields, values, locale, displayName, index, collapsedFieldValues, mode }) => {
  const currentValues = values[index];
  const [selectedIndex, setSelectedIndex] = useState(null);
  const dispatch = useDispatch();
  const [verifyModal, setVerifyModal] = useState(false);
  const [verificationValue, setVeficationValue] = useState(currentValues?.ctfmr_verified || '') //Dropdown selected state
  const violationTally = getViolationTallyLabel(fields, currentValues, locale);
  const verifyParams = useParams();
  const handleOpenVerifyModal = (index,event) => {    //  To open verify dialog confirmation popup
    event.stopPropagation();
    setSelectedIndex(index);
    setVerifyModal(true);
  };

  const cancelVerifyHandler = () => {   //  To close veify dialog popup
    setVerifyModal(false);
    setSelectedIndex(null);
  };
  const {
    canVerify
  } = usePermissions("incidents", RECORD_ACTION_ABILITIES);   //  To check permission to do verify violations

  useEffect(() => { // Changing dropdown select value when backend data updated
    setVeficationValue(currentValues?.ctfmr_verified)
  }, [currentValues?.ctfmr_verified]);

  const violationType = currentValues.type    //  To get the violation type through index
  const handleOk = () => {    //  To update the verify status to Verified
    dispatch(
      saveRecord(
        verifyParams.recordType,
        "update",
        {data: { [currentValues.type]: [ {  unique_id: currentValues.unique_id, ctfmr_verified: verificationValue, ctfmr_verified_date: toServerDateFormat(current_date) } ]}}, // Save API Call
        verifyParams.id,
        "Updated successfully",
        "",
        false,
        false
      )
    );
    close();
  };
  const i18n = useI18n();

  return (

    <ListItemText
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
      { (canVerify && mode.isShow) ? 
          (<Button
            onClick={ (event) => handleOpenVerifyModal(index,event)}
            id={`verify-button-${name}-${index}`}
            className={css.verifiedSpan}
            color="primary"
            variant="contained"
            size="small"
            disableElevation>
            {i18n.t("incidents.change_status")}
          </Button>)
          : null
      }
      <ViolationTitle title={displayName?.[locale]} values={currentValues} fields={fields} />

      <ActionDialog
           open={verifyModal}
           successHandler={handleOk}
           cancelHandler={cancelVerifyHandler}
           dialogTitle={i18n.t("incidents.change_status")}
           confirmButtonLabel={i18n.t("buttons.update")}
           maxSize="xs"
          >
        <VerifySelect selectedValue={verificationValue} setSelectedValue={setVeficationValue} />
      </ActionDialog>
    </ListItemText>
  );
};

Component.propTypes = {
  collapsedFieldValues: PropTypes.node,
  displayName: PropTypes.object,
  fields: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  locale: PropTypes.string.isRequired,
  values: PropTypes.array.isRequired,
  mode: PropTypes.object.isRequired
};

Component.displayName = NAME;

export default Component;
