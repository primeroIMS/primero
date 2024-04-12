// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

const submitForm = ref => {
  if (ref.current) {
    ref.current.submitForm();
  }
};

export default submitForm;
