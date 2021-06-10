import { getIn } from "formik";
import isEqual from "lodash/isEqual";

export default (nextProps, currentProps) => {
  return (
    !isEqual(nextProps?.filters?.filterState, currentProps?.filters?.filterState) ||
    !isEqual(nextProps?.filters?.values, currentProps?.filters?.values) ||
    nextProps?.locale !== currentProps?.locale ||
    nextProps?.options?.length !== currentProps?.options?.length ||
    nextProps.name !== currentProps.name ||
    nextProps.required !== currentProps.required ||
    nextProps.disabled !== currentProps.disabled ||
    nextProps.readOnly !== currentProps.readOnly ||
    nextProps.formik.isSubmitting !== currentProps.formik.isSubmitting ||
    Object.keys(nextProps).length !== Object.keys(currentProps).length ||
    getIn(nextProps.formik.values, currentProps.name) !== getIn(currentProps.formik.values, currentProps.name) ||
    getIn(nextProps.formik.errors, currentProps.name) !== getIn(currentProps.formik.errors, currentProps.name) ||
    getIn(nextProps.formik.touched, currentProps.name) !== getIn(currentProps.formik.touched, currentProps.name)
  );
};
