import { push } from "connected-react-router";
import isEmpty from "lodash/isEmpty";
import isString from "lodash/isString";
import { useCallback, useState } from "react";
import { batch, useDispatch } from "react-redux";

import { ID_FIELD, INCIDENT_CASE_ID_DISPLAY_FIELD, MODULE_TYPE_FIELD, RECORD_PATH } from "../../config";
import { useMemoizedSelector, buildFieldMap } from "../../libs";
import { useDialog } from "../action-dialog";
import { setSelectedForm } from "../record-form/action-creators";

import { offlineIncidentFromCase } from "./action-creators";
import { getFieldMap } from "./selectors";

const INCIDENT_REDIRECT_DIALOG = "incidentRedirectDialog";

const useIncidentFromCase = ({ record, mode }) => {
  const dispatch = useDispatch();
  const { dialogOpen, dialogClose, setDialog, params: dialogParams } = useDialog(INCIDENT_REDIRECT_DIALOG);

  const modeNotShow = !mode.isShow;
  const moduleID = record ? record.get(MODULE_TYPE_FIELD) : "";

  const [saveBeforeIncidentRedirect, setSaveBeforeIncidentRedirect] = useState(false);

  const fieldMap = useMemoizedSelector(state => getFieldMap(state, moduleID));

  const setCaseIncidentData = (data, path, dirty) => {
    if (!mode.isNew) {
      const formData = data || record;

      dispatch(
        offlineIncidentFromCase({
          moduleID,
          caseID: record.get(ID_FIELD),
          caseDisplayID: record.get(INCIDENT_CASE_ID_DISPLAY_FIELD),
          data: buildFieldMap(formData, fieldMap)
        })
      );

      if (!modeNotShow || (modeNotShow && !dirty)) {
        const incidentPath =
          isString(path) && !isEmpty(path) ? path : `/${RECORD_PATH.incidents}/${record.get(MODULE_TYPE_FIELD)}/new`;

        batch(() => {
          dispatch(push(incidentPath));
          dispatch(setSelectedForm(""));
        });
      }

      setSaveBeforeIncidentRedirect(false);
    }
  };

  const handleCreateIncident = (path, dirty) => {
    if (modeNotShow && dirty) {
      setDialog({ dialog: INCIDENT_REDIRECT_DIALOG, open: true, params: { ...(isString(path) && { path }) } });
    } else {
      setCaseIncidentData(false, path, dirty);
    }
  };

  const setSaveCaseBeforeRedirect = useCallback((value = false) => {
    setSaveBeforeIncidentRedirect(value);
  }, []);

  return {
    handleCreateIncident,
    redirectDialogOpen: dialogOpen,
    closeRedirectDialog: dialogClose,
    saveBeforeIncidentRedirect,
    setCaseIncidentData,
    setSaveCaseBeforeRedirect,
    dialogParams
  };
};

export default useIncidentFromCase;
