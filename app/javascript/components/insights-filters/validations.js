import isEmpty from "lodash/isEmpty";
import { object, string } from "yup";

const customDateValidation = string().when("date_range", {
  is: "custom",
  then: string().required()
});

export default object().shape({
  date: string()
    .nullable()
    .ensure()
    .when("date_range", {
      is: value => !isEmpty(value),
      then: string().nullable().required()
    }),
  date_range: string()
    .nullable()
    .when("view_by", {
      is: value => !isEmpty(value),
      then: string().nullable().required()
    }),
  from: customDateValidation,
  to: customDateValidation
});
