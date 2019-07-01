import React from "react";
import PropTypes from "prop-types";
import { Fab, Box } from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import { useI18n } from "components/i18n";
import styles from "../styles.css";

const RecordFormToolbar = ({
  mode,
  params,
  recordType,
  handleFormSubmit,
  shortId
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const PageHeading = () => {
    let heading = "";

    if (mode.isNew) {
      heading = i18n.t(`${params.recordType}.register_new_${recordType}`);
    } else if (mode.isEdit || mode.isShow) {
      heading = i18n.t(`${params.recordType}.show_${recordType}`, {
        short_id: shortId
      });
    }

    return <h2>{heading}</h2>;
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
        <Fab
          className={css.actionButtonCancel}
          variant="extended"
          aria-label={i18n.t("buttons.cancel")}
          component={Link}
          to={`/${params.recordType}`}
        >
          {i18n.t("buttons.cancel")}
        </Fab>
        {(mode.isEdit || mode.isNew) && (
          <Fab
            className={css.actionButton}
            variant="extended"
            aria-label={i18n.t("buttons.save")}
            onClick={handleFormSubmit}
          >
            {i18n.t("buttons.save")}
          </Fab>
        )}
        {mode.isShow && (
          <Fab
            className={css.actionButton}
            variant="extended"
            aria-label={i18n.t("buttons.edit")}
            component={Link}
            to={`/${params.recordType}/${params.id}/edit`}
          >
            {i18n.t("buttons.edit")}
          </Fab>
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
  shortId: PropTypes.string
};

export default RecordFormToolbar;
