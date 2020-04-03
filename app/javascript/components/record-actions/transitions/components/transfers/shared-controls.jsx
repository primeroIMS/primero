import { FormControlLabel } from "@material-ui/core";
import { Field } from "formik";
import { Checkbox as MuiCheckbox } from "formik-material-ui";
import React from "react";

export default (i18n, disableControl) => {
  const sharedFields = [
    {
      id: "remoteSystem",
      label: i18n.t("transfer.is_remote_label")
    },
    {
      id: "consent_individual_transfer",
      label: i18n.t("transfer.consent_from_individual_label")
    }
  ];

  return sharedFields.map(field => (
    <FormControlLabel
      key={field.id}
      control={
        <Field
          name={field.id}
          component={MuiCheckbox}
          disabled={disableControl}
        />
      }
      label={field.label}
    />
  ));
};
