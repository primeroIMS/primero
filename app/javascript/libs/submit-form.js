const submitForm = ref => {
  if (ref.current) {
    ref.current.submitForm();
  }
};

export default submitForm;
