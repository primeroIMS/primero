/* eslint-disable react/no-multi-comp, react/display-name, react/prop-types */

import { Form, Formik, useFormikContext } from "formik";
import isEmpty from "lodash/isEmpty";

function FormikValueFromHook() {
  return null;
}

function FormikForm({ children }) {
  const formContext = useFormikContext();

  return (
    <Form>
      <FormikValueFromHook {...formContext} />
      {children}
    </Form>
  );
}

function FormikProvider({ formProps, children }) {
  if (isEmpty(formProps)) {
    return children;
  }

  return (
    <Formik {...formProps}>
      <FormikForm>{children}</FormikForm>
    </Formik>
  );
}

export { FormikForm, FormikValueFromHook, FormikProvider };
