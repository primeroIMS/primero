// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

const resetForm = formikRef => {
  if (formikRef.current) {
    formikRef.current.resetForm();
  }
};

export default resetForm;
