const submitForm = formikRef => {
  if (formikRef.current) {
    formikRef.current.submitForm();
  }
};

export default submitForm;
