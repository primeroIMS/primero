import React, { forwardRef, useImperativeHandle, useRef } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import { useFormContext } from "react-hook-form";
import html2pdf from "html2pdf.js";
import { useDispatch, useSelector } from "react-redux";
import { fromJS, isImmutable } from "immutable";

import { useI18n } from "../i18n";
import { enqueueSnackbar } from "../notifier";

import { HTML_2_PDF_OPTIONS } from "./constants";
import styles from "./styles.css";
import { addPageHeaderFooter } from "./utils";
import Table from "./components/table";

const Component = (
  { forms, record, formsSelectedField, formsSelectedSelector, formsSelectedFieldDefault, customFilenameField },
  ref
) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const { watch } = useFormContext();
  const html = useRef();
  const dispatch = useDispatch();
  const data = isImmutable(record) ? record : fromJS(record);
  const userSelectedForms = formsSelectedField ? watch(formsSelectedField, formsSelectedFieldDefault || []) : false;
  const formSelectorResults = useSelector(state => {
    if (formsSelectedSelector) {
      return formsSelectedSelector(state, userSelectedForms);
    }

    return fromJS([]);
  });

  const filteredByFields = formsSelectedSelector ? formSelectorResults?.toJS() : userSelectedForms;

  const selectedForms = filteredByFields?.length
    ? forms.filter(form => filteredByFields.includes(form.unique_id))
    : forms;

  useImperativeHandle(ref, () => ({
    savePdf({ setPending, close, values }) {
      setPending(true);

      // TODO: Will add back when we create api endpoint to fetch base64 images
      // const logos = await Logos.find();
      // eslint-disable-next-line camelcase
      // const logo = await buildHeaderImage(logos?.[0]?.images?.logo_full);

      html2pdf()
        .from(html.current)
        .set(HTML_2_PDF_OPTIONS(values, data, customFilenameField))
        .toPdf()
        .get("pdf")
        .then(pdf => {
          addPageHeaderFooter(pdf, data, i18n);
        })
        .save()
        .then(() => {
          dispatch(enqueueSnackbar(i18n.t("exports.exported"), { type: "success" }));
          setPending(false);
          close();
        })
        .catch(error => {
          dispatch(enqueueSnackbar(i18n.t("exports.exported_error"), { type: "error" }));
          setPending(false);
          // eslint-disable-next-line no-console
          console.warn(error);
        });
    }
  }));

  return (
    <div ref={html} className={css.container}>
      {selectedForms.map(form => (
        <div key={`selected-${form.unique_id}`}>
          <h2>{i18n.getI18nStringFromObject(form.name)}</h2>
          <Table fields={form.fields} record={data} />
        </div>
      ))}
    </div>
  );
};

Component.displayName = "PdfExporter";

Component.propTypes = {
  customFilenameField: PropTypes.string.isRequired,
  forms: PropTypes.object.isRequired,
  formsSelectedField: PropTypes.string,
  formsSelectedFieldDefault: PropTypes.any,
  formsSelectedSelector: PropTypes.func,
  record: PropTypes.object.isRequired,
};

export default forwardRef(Component);
