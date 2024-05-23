// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Fragment } from "react";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";

import { useI18n } from "../../../../../../i18n";
import FieldRows from "../field-rows/component";

const ComparedForms = ({ forms }) => {
  const i18n = useI18n();

  return forms.map(({ form, comparisons, index }) => (
    <Fragment key={`${form?.unique_id}-${index}`}>
      <Grid container item>
        <Grid item xs={12}>
          <h2>{form?.name[i18n.locale]}</h2>
        </Grid>
      </Grid>
      <FieldRows comparisons={comparisons} />
    </Fragment>
  ));
};

ComparedForms.propTypes = {
  forms: PropTypes.object
};

ComparedForms.displayName = "ComparedForms";

export default ComparedForms;
