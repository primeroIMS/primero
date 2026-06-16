const resetForm = formikRef => {
  if (formikRef.current) {
    formikRef.current.resetForm();
  }
};

export default resetForm;
