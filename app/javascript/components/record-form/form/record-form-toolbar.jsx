import React from "react";
import PropTypes from "prop-types";
import { Box, Button, Fab, CircularProgress } from "@material-ui/core";
import { withRouter, Link } from "react-router-dom";
import CreateIcon from "@material-ui/icons/Create";
import { useSelector } from "react-redux";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

import { useI18n } from "../../i18n";
import Flagging from "../../flagging";
import RecordActions from "../../record-actions";
import Permission from "../../application/permission";
import { FLAG_RECORDS, WRITE_RECORDS } from "../../../libs/permissions";
import { getSavingRecord } from "../../records/selectors";
import { RECORD_PATH } from "../../../config";
import DisableOffline from "../../disable-offline";
import { useThemeHelper } from "../../../libs";
import ButtonText from "../../button-text";

import { RECORD_FORM_TOOLBAR_NAME } from "./constants";
import { WorkflowIndicator } from "./components";
import PageHeading from "./page-heading";
import styles from "./styles.css";

const RecordFormToolbar = ({
  handleFormSubmit,
  caseIdDisplay,
  history,
  mode,
  params,
  primeroModule,
  record,
  recordType,
  shortId
}) => {
  const { css } = useThemeHelper(styles);
  const i18n = useI18n();
  const savingRecord = useSelector(state =>
    getSavingRecord(state, params.recordType)
  );

  const goBack = () => {
    history.goBack();
  };

  const renderCircularProgress = savingRecord && (
    <CircularProgress size={24} value={25} className={css.loadingMargin} />
  );

  const renderSaveButton = (
    <Button
      className={css.actionButton}
      onClick={handleFormSubmit}
      disabled={savingRecord}
      size="small"
      startIcon={<CheckIcon />}
    >
      {renderCircularProgress}
      <ButtonText text={i18n.t("buttons.save")} />
    </Button>
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
        <PageHeading
          caseIdDisplay={caseIdDisplay}
          i18n={i18n}
          mode={mode}
          params={params}
          recordType={recordType}
          shortId={shortId}
          toolbarHeading={css.toolbarHeading}
        />
        {renderRecordStatusIndicator}
      </Box>
      <div className={css.actionsContainer}>
        {mode.isShow && params && (
          <Permission resources={params.recordType} actions={FLAG_RECORDS}>
            <DisableOffline button>
              <Flagging
                record={params.id}
                recordType={params.recordType}
                showActionButtonCss={css.showActionButton}
              />
            </DisableOffline>
          </Permission>
        )}
        {(mode.isEdit || mode.isNew) && (
          <div className={css.actionButtonsContainer}>
            <Button
              className={css.actionButtonCancel}
              size="small"
              onClick={goBack}
              startIcon={<ClearIcon />}
            >
              <ButtonText text={i18n.t("buttons.cancel")} />
            </Button>
            {renderSaveButton}
          </div>
        )}
        {mode.isShow && (
          <Permission resources={params.recordType} actions={WRITE_RECORDS}>
            <Button
              to={`/${params.recordType}/${params.id}/edit`}
              component={Link}
              size="small"
              className={css.showActionButton}
              startIcon={<CreateIcon />}
            >
              <ButtonText text={i18n.t("buttons.edit")} />
            </Button>
          </Permission>
        )}
        <RecordActions
          recordType={params.recordType}
          record={record}
          mode={mode}
        />
      </div>
    </Box>
  );
};

RecordFormToolbar.displayName = RECORD_FORM_TOOLBAR_NAME;

RecordFormToolbar.propTypes = {
  caseIdDisplay: PropTypes.string,
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
