import React, { useEffect } from "react";
import { RecordForm } from "components/record-form";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import mockedData from "./mocked-data";

const CaseNew = ({ fetchForms }) => {
  useEffect(() => {
    fetchForms();
  });

  return (
    <>
      <RecordForm />
    </>
  );
};

CaseNew.propTypes = {
  fetchForms: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  fetchForms: () =>
    dispatch({ type: "CaseForms/SET_FORMS", payload: mockedData })
});

export default connect(
  null,
  mapDispatchToProps
)(CaseNew);
