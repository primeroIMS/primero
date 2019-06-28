import React, { useEffect } from "react";
import {
  RecordForm,
  fetchForms,
  getFormNav,
  getRecordForms
} from "components/record-form";
import { useDispatch, useSelector } from "react-redux";

const TracingRequestShow = () => {
  // TODO: Needs to endpoint
  const selectedModule = { recordType: "case", primeroModule: "cp" };
  const dispatch = useDispatch();
  const formNav = useSelector(state => getFormNav(state, selectedModule));
  const forms = useSelector(state => getRecordForms(state, selectedModule));

  useEffect(() => {
    dispatch(fetchForms());
  }, []);

  return (
    <>
      <RecordForm
        formNav={formNav}
        forms={forms}
        isShow
        recordType="Tracing Request"
        recordId="passtherecordid"
      />
    </>
  );
};

export default TracingRequestShow;
