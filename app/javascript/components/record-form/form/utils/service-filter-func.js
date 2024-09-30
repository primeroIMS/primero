// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { getIn } from "formik";

export default (values, _parentField, subformField) => {
  switch (subformField.option_strings_source) {
    case "Agency":
      return {
        service: getIn(values, `service_type`)
      };
    case "User":
      return {
        service: getIn(values, `service_type`),
        location: getIn(values, `service_delivery_location`),
        agency: getIn(values, `service_implementing_agency`)
      };
    default:
      return {};
  }
};
