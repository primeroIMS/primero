import React from "react";
import PropTypes from "prop-types";
import { Box, IconButton, Fab } from "@material-ui/core";
import { withRouter, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import { useI18n } from "components/i18n";
import CreateIcon from "@material-ui/icons/Create";
import { useDispatch } from "react-redux";
import {
  setDirtyForm,
  setCancelButtonForm
} from "components/record-form/action-creators";
import { AlertDialog } from "components/alert-dialog";
import styles from "./styles.css";

const RecordFormToolbar = ({
  mode,
  params,
  recordType,
  handleFormSubmit,
  shortId,
  history,
  isDirtyForm,
  cancelClicked
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const dispatch = useDispatch();

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

  const setClickedButton = val => dispatch(setCancelButtonForm(val));

  const handleCancelButton = () => {
    setClickedButton(true);
    if (!isDirtyForm) {
      goBack();
      setClickedButton(false);
    }
  };

  return (
    <Box
      className={css.toolbar}
      width="100%"
      px={2}
      mb={3}
      display="flex"
      alignItems="center"
    >
      <AlertDialog
        open={isDirtyForm && cancelClicked}
        successHandler={() => {
          goBack();
          dispatch(setDirtyForm(false));
        }}
        cancelHandler={() => setClickedButton(false)}
      />
      <Box flexGrow={1}>
        <PageHeading />
      </Box>
      <Box>
        {(mode.isEdit || mode.isNew) && (
          <>
            <Fab
              className={css.actionButtonCancel}
              variant="extended"
              aria-label={i18n.t("buttons.cancel")}
              onClick={handleCancelButton}
            >
              {i18n.t("buttons.cancel")}
            </Fab>
            <Fab
              className={css.actionButton}
              variant="extended"
              aria-label={i18n.t("buttons.save")}
              onClick={handleFormSubmit}
            >
              {i18n.t("buttons.save")}
            </Fab>
          </>
        )}
        {mode.isShow && (
          <IconButton
            to={`/${params.recordType}/${params.id}/edit`}
            component={Link}
          >
            <CreateIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

RecordFormToolbar.propTypes = {
  mode: PropTypes.object,
  params: PropTypes.object.isRequired,
  recordType: PropTypes.string.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  shortId: PropTypes.string,
  history: PropTypes.object,
  isDirtyForm: PropTypes.bool,
  cancelClicked: PropTypes.bool
};

export default withRouter(RecordFormToolbar);
