import React from "react";
import PropTypes from "prop-types";
import { Box, IconButton } from "@material-ui/core";
import { withRouter, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import { useI18n } from "components/i18n";
import CreateIcon from "@material-ui/icons/Create";
import CancelIcon from "@material-ui/icons/Cancel";
import styles from "./styles.css";

const RecordFormToolbar = ({
  mode,
  params,
  recordType,
  handleFormSubmit,
  shortId,
  history
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

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

  return (
    <Box
      className={css.toolbar}
      width="100%"
      px={2}
      mb={3}
      display="flex"
      alignItems="center"
    >
      <Box flexGrow={1}>
        <PageHeading />
      </Box>
      <Box>
        {(mode.isEdit || mode.isNew) && (
          <>
            <IconButton onClick={goBack}>
              <CancelIcon />
            </IconButton>
            <IconButton color="primary" onClick={handleFormSubmit}>
              <CreateIcon />
            </IconButton>
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
  history: PropTypes.object
};

export default withRouter(RecordFormToolbar);
