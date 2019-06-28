import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Grid, Box, Fab } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { Link } from "react-router-dom";
import { Nav } from "./nav";
import NAMESPACE from "./namespace";
import { RecordForm } from "./form";
import styles from "./styles.css";
import { setSelectedForm } from "./action-creators";

// TODO: Initial form to show
const RecordForms = ({
  formNav,
  forms,
  isShow,
  isNew,
  isEdit,
  recordType,
  recordId
}) => {
  const css = makeStyles(styles)();
  const dispatch = useDispatch();

  let submitForm = null;

  const handleFormSubmit = e => {
    if (submitForm) {
      submitForm(e);
    }
  };

  const selectedForm = useSelector(state =>
    state.getIn([NAMESPACE, "selectedForm"])
  );

  const formProps = {
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
      }, 400);
    },
    bindSubmitForm: boundSubmitForm => {
      submitForm = boundSubmitForm;
    },
    selectedForm,
    forms,
    mode: { isShow, isEdit, isNew }
  };

  const isNewOrEdit = () => {
    if (isNew) return "New";
    if (isEdit) return "Edit";
    return "";
  };

  useEffect(() => {
    if (!selectedForm) {
      dispatch(setSelectedForm("basic_identity"));
    }
  }, []);

  return (
    <>
      <Grid container>
        <Box
          className={css.toolbar}
          width="100%"
          px={2}
          mb={3}
          display="flex"
          alignItems="center"
        >
          <Box flexGrow={1}>
            <h2>
              {isShow ? "" : isNewOrEdit()} {recordType}{" "}
              {isShow ? recordId : ""}
            </h2>
          </Box>
          <Box>
            {(isEdit || isNew) && (
              <Fab
                className={css.actionButton}
                variant="extended"
                aria-label="Save"
                onClick={handleFormSubmit}
              >
                Save
              </Fab>
            )}
            {isShow && (
              <Fab
                className={css.actionButton}
                variant="extended"
                aria-label="Save"
                component={Link}
                to={`/cases/${recordId}/edit`}
              >
                Edit
              </Fab>
            )}
          </Box>
        </Box>
        <Box display="flex" width="100%" height="100%">
          <Box width={255}>
            <Nav formNav={formNav} selectedForm={selectedForm} />
          </Box>
          <Box className={css.divider}>
            <Box className={css.dividerInner} />
          </Box>
          <Box width={680} px={3}>
            {forms && <RecordForm {...formProps} />}
          </Box>
        </Box>
      </Grid>
    </>
  );
};

RecordForms.propTypes = {
  formNav: PropTypes.object,
  forms: PropTypes.object,
  isShow: PropTypes.bool,
  recordType: PropTypes.string,
  isNew: PropTypes.bool,
  isEdit: PropTypes.bool,
  recordId: PropTypes.string
};

export default RecordForms;
