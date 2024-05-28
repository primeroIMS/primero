// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { Grid } from "@material-ui/core";

import { useI18n } from "../../../../../../i18n";
import FieldRow from "../field-row";

import css from "./styles.css";

const FieldRows = ({ comparisons }) => {
  const i18n = useI18n();

  if (isEmpty(comparisons)) {
    return (
      <Grid container item>
        <Grid item xs={12}>
          <span className={css.nothingFound}>{i18n.t("tracing_request.messages.nothing_found")}</span>
        </Grid>
      </Grid>
    );
  }

  return comparisons.map(comparison => (
    <FieldRow
      field={comparison.field}
      traceValue={comparison.traceValue}
      caseValue={comparison.caseValue}
      match={comparison.match}
      key={comparison.field.name}
    />
  ));
};

FieldRows.propTypes = {
  comparisons: PropTypes.array
};

FieldRows.displayName = "FieldRows";

export default FieldRows;
