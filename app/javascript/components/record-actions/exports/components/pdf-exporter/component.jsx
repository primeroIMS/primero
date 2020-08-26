import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";

import { useI18n } from "../../../../i18n";

import styles from "./styles.css";
// TODO: styling, subforms, header, filter unwanted forms
const Component = ({ forms, record }, ref) => {
  const { getI18nStringFromObject } = useI18n();
  const css = makeStyles(styles)();

  return (
    <div ref={ref} className={css.container}>
      {forms.map(form => (
        <div>
          <h1>{getI18nStringFromObject(form.name)}</h1>
          <table>
            <tbody>
              {form.fields.map(field => {
                return (
                  <tr>
                    <td>{getI18nStringFromObject(field.display_name)}</td>
                    <td>{record.get(field.name)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

Component.displayName = "PdfExporter";

Component.propTypes = {
  forms: PropTypes.object.isRequired,
  record: PropTypes.object.isRequired
};

export default forwardRef(Component);
