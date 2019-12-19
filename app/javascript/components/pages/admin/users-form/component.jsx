import React, { useRef } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import * as yup from "yup";

import { useI18n } from "../../../i18n";
import Form from "../../../form";
import { PageHeading, PageContent } from "../../../page";

import form from "./form";

const validationSchema = yup.object().shape({
  note_subject: yup.string().required(),
  note_text: yup.string().required()
});

const Component = ({ mode }) => {
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();

  const handleSubmit = data => {
    console.log(data);
  };

  const bindFormSubmit = () => {
    formRef.current.submitForm();
  };

  return (
    <>
      <PageHeading title={i18n.t("users.label")} />
      <PageContent>
        <Form
          formMode={mode}
          formSections={form(i18n)}
          onSubmit={handleSubmit}
          ref={formRef}
          validations={validationSchema}
        />
      </PageContent>
    </>
  );
};

Component.displayName = "UsersForm";

Component.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Component;
