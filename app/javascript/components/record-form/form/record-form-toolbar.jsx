import React from "react";
import PropTypes from "prop-types";
import { Box, IconButton, Fab, CircularProgress } from "@material-ui/core";
import { withRouter, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import CreateIcon from "@material-ui/icons/Create";
import { useSelector } from "react-redux";

import { useI18n } from "../../i18n";
import { Flagging } from "../../flagging";
import RecordActions from "../../record-actions";
import Permission from "../../application/permission";
import { FLAG_RECORDS, WRITE_RECORDS } from "../../../libs/permissions";
import { getSavingRecord } from "../../records/selectors";
import { RECORD_PATH } from "../../../config";
import DisableOffline from "../../disable-offline";

import { RECORD_FORM_TOOLBAR_NAME } from "./constants";
import { WorkflowIndicator } from "./components";
import styles from "./styles.css";

const RecordFormToolbar = ({
  mode,
  params,
  recordType,
  handleFormSubmit,
  shortId,
  history,
  primeroModule,
  record
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const savingRecord = useSelector(state =>
    getSavingRecord(state, params.recordType)
  );

  const PageHeading = () => {
    let heading = "";

    if (mode.isNew) {
      heading = i18n.t(`${params.recordType}.register_new_${recordType}`);
    } else if (mode.isEdit || mode.isShow) {
      heading = i18n.t(`${params.recordType}.show_${recordType}`, {
        short_id: shortId || "-------"
      });
    }

    return <h2 className={css.toolbarHeading}>{heading}</h2>;
  };

  const goBack = () => {
    history.goBack();
  };

  const renderCircularProgress = savingRecord && (
    <CircularProgress size={24} value={25} className={css.loadingMargin} />
  );

  const renderSaveButton = (
    <Fab
      className={css.actionButton}
      variant="extended"
      aria-label={i18n.t("buttons.save")}
      onClick={handleFormSubmit}
      disabled={savingRecord}
    >
      {renderCircularProgress}
      {i18n.t("buttons.save")}
    </Fab>
  );

  let renderRecordStatusIndicator = null;

  if (record && !record.get("record_state")) {
    renderRecordStatusIndicator = (
      <h3 className={css.caseDisabled}>
        {i18n.t("case.messages.case_disabled")}
      </h3>
    );
  } else if (
    (mode.isShow || mode.isEdit) &&
    params.recordType === RECORD_PATH.cases
  ) {
    renderRecordStatusIndicator = (
      <WorkflowIndicator
        locale={i18n.locale}
        primeroModule={primeroModule}
        recordType={params.recordType}
        record={record}
      />
    );
  }

  return (
    <Box
      className={css.toolbar}
      width="100%"
      px={2}
      mb={3}
      display="flex"
      alignItems="center"
    >
      <Box flexGrow={1} display="flex" flexDirection="column">
        <PageHeading />
        {renderRecordStatusIndicator}
      </Box>
      <Box display="flex">
        {mode.isShow && params && (
          <Permission resources={params.recordType} actions={FLAG_RECORDS}>
            <DisableOffline>
              <Flagging recordType={params.recordType} record={params.id} />
            </DisableOffline>
          </Permission>
        )}
        {(mode.isEdit || mode.isNew) && (
          <div className={css.actionButtonsContainer}>
            <Fab
              className={css.actionButtonCancel}
              variant="extended"
              aria-label={i18n.t("buttons.cancel")}
              onClick={goBack}
            >
              {i18n.t("buttons.cancel")}
            </Fab>
            {renderSaveButton}
          </div>
        )}
        {mode.isShow && (
          <Permission resources={params.recordType} actions={WRITE_RECORDS}>
            <IconButton
              to={`/${params.recordType}/${params.id}/edit`}
              component={Link}
            >
              <CreateIcon />
            </IconButton>
          </Permission>
        )}
        <RecordActions
          recordType={params.recordType}
          record={record}
          mode={mode}
        />
      </Box>
    </Box>
  );
};

RecordFormToolbar.displayName = RECORD_FORM_TOOLBAR_NAME;

RecordFormToolbar.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  history: PropTypes.object,
  mode: PropTypes.object,
  params: PropTypes.object.isRequired,
  primeroModule: PropTypes.string.isRequired,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  shortId: PropTypes.string
};

export default withRouter(RecordFormToolbar);
