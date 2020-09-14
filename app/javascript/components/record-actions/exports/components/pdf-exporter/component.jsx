import React, { forwardRef, useImperativeHandle, useRef } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import { useFormContext } from "react-hook-form";
import html2pdf from "html2pdf.js";
import { useDispatch, useSelector } from "react-redux";

import { useI18n } from "../../../../i18n";
import { FORM_TO_EXPORT_FIELD } from "../../constants";
import { enqueueSnackbar } from "../../../../notifier";
import Logos from "../../../../../db/collections/logos";

import { HTML_2_PDF_OPTIONS } from "./constants";
import styles from "./styles.css";
import { addPageHeaderFooter, buildHeaderImage } from "./utils";
import Table from "./components/table";

const Component = ({ forms, record }, ref) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const { watch } = useFormContext();
  const html = useRef();
  const dispatch = useDispatch();

  const userSelectedForms = watch(FORM_TO_EXPORT_FIELD, []);
  const selectedForms = userSelectedForms?.length
    ? forms.filter(form => userSelectedForms.includes(form.unique_id))
    : forms;

  useImperativeHandle(ref, () => ({
    async savePdf({ setPending, close, values }) {
      setPending(true);

      const logos = await Logos.find();
      // eslint-disable-next-line camelcase
      const logo = await buildHeaderImage(logos?.[0]?.images?.logo_full);

      html2pdf()
        .from(html.current)
        .set(HTML_2_PDF_OPTIONS(values, record))
        .toPdf()
        .get("pdf")
        .then(pdf => {
          addPageHeaderFooter(pdf, record, i18n, logo);
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
          <Table fields={form.fields} record={record} />
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
