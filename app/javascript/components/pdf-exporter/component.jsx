import React, { forwardRef, useImperativeHandle, useRef } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import { useFormContext } from "react-hook-form";
import html2pdf from "html2pdf-dom-to-image-more";
import { useDispatch, useSelector } from "react-redux";
import { fromJS, isImmutable } from "immutable";

import { useI18n } from "../i18n";
import { enqueueSnackbar } from "../notifier";

import { getCustomFormTitle } from "./selectors";
import { HTML_2_PDF_OPTIONS } from "./constants";
import styles from "./styles.css";
import { addPageHeaderFooter } from "./utils";
import RenderTable from "./components/render-table";

const Component = (
  {
    forms,
    record,
    formsSelectedField,
    formsSelectedSelector,
    formsSelectedFieldDefault,
    customFilenameField,
    customFormProps
  },
  ref
) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const { watch } = useFormContext();
  const html = useRef();
  const dispatch = useDispatch();
  const data = isImmutable(record) ? record : fromJS(record);
  const { title = "", condition = false, fields: customFormFields = [] } = customFormProps || {};
  const isRemote = typeof condition === "boolean" ? condition : watch(condition);
  const customTitle = useSelector(state => getCustomFormTitle(state, title, watch));

  const watchedValues = watch(customFormFields.map(referralField => referralField.name));

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
      let worker = html2pdf().set(HTML_2_PDF_OPTIONS(values, data, customFilenameField));
      const pages = Array.from(html.current.childNodes);

      pages.forEach((page, index) => {
        worker = worker
          .from(page)
          .toContainer(index + 1)
          .toCanvas()
          .toPdf()
          .get("pdf")
          .then(pdf => {
            addPageHeaderFooter(pdf, data, i18n);

            if (index < pages.length - 1) {
              pdf.addPage();
            }
          });
      });

      worker
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
      {customFormProps && isRemote && (
        <RenderTable title={customTitle} fields={customFormFields} data={fromJS(watchedValues)} />
      )}
      {selectedForms?.map(form => (
        <RenderTable
          key={`selected-${form.unique_id}`}
          title={i18n.getI18nStringFromObject(form.name)}
          fields={form.fields}
          data={data}
        />
      ))}
    </div>
  );
};

Component.displayName = "PdfExporter";

Component.propTypes = {
  customFilenameField: PropTypes.string.isRequired,
  customFormProps: PropTypes.shape({
    condition: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    fields: PropTypes.array.isRequired,
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        selector: PropTypes.func.isRequired,
        selectorNameProp: PropTypes.string.isRequired,
        watchedId: PropTypes.string.isRequired
      })
    ])
  }),
  forms: PropTypes.object.isRequired,
  formsSelectedField: PropTypes.string,
  formsSelectedFieldDefault: PropTypes.any,
  formsSelectedSelector: PropTypes.func,
  record: PropTypes.object.isRequired
};

export default forwardRef(Component);
