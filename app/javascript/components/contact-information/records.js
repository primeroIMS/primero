// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import { Record, fromJS } from "immutable";

export const ContactInformationRecord = Record({
  name: "",
  organization: "",
  phone: "",
  other_information: "",
  support_forum: "",
  email: "",
  location: "",
  position: "",
  system_version: "",
  agencies: fromJS([]),
  demo: false
});
