import { forwardRef, useImperativeHandle, useRef } from "react";
import PropTypes from "prop-types";
import { makeStyles, Typography } from "@material-ui/core";
import { useWatch } from "react-hook-form";
import html2pdf from "html2pdf-dom-to-image-more";
import { useDispatch } from "react-redux";
import { fromJS, isImmutable } from "immutable";

import { useI18n } from "../i18n";
import { enqueueSnackbar } from "../notifier";
import {
  CUSTOM_HEADER,
  HEADER,
  SIGNATURES,
  INCLUDE_IMPLEMENTATION_LOGOS,
  INCLUDE_AGENCY_LOGO,
  INCLUDE_OTHER_LOGOS
} from "../record-actions/exports/constants";
import useOptions from "../form/use-options";

import Signatures from "./components/signatures";
import { HTML_2_PDF_OPTIONS, PDF_HEADER_LOOKUP } from "./constants";
import styles from "./styles.css";
import { addPageHeaderFooter, getLogosToRender } from "./utils";
import RenderTable from "./components/render-table";
import Logos from "./components/logos";

const useStyles = makeStyles(styles);

const Component = forwardRef(
  (
    {
      forms,
      record,
      formMethods,
      formsSelectedField,
      formsSelectedSelector,
      formsSelectedFieldDefault,
      customFilenameField,
      customFormProps,
      currentUser,
      agenciesWithLogosEnabled,
      agencyLogosPdf
    },
    ref
  ) => {
    const i18n = useI18n();
    const css = useStyles();
    const html = useRef();
    const mainHeaderRef = useRef();
    const secondaryHeaderRef = useRef();
    const dispatch = useDispatch();

    const { control, watch } = formMethods;

    const data = isImmutable(record) ? record : fromJS(record);

    const { title = "", condition = false, fields: customFormFields = [] } = customFormProps;

    const isRemote = typeof condition === "boolean" ? condition : watch(condition);

    const {
      [CUSTOM_HEADER]: customHeader,
      [HEADER]: header,
      [SIGNATURES]: signatures,
      [INCLUDE_IMPLEMENTATION_LOGOS]: includeImplementationLogos,
      [INCLUDE_AGENCY_LOGO]: includeAgencyLogos,
      [INCLUDE_OTHER_LOGOS]: includeOtherLogos
    } = useWatch({
      control,
      name: [CUSTOM_HEADER, HEADER, SIGNATURES, INCLUDE_IMPLEMENTATION_LOGOS, INCLUDE_AGENCY_LOGO, INCLUDE_OTHER_LOGOS]
    });

    const watchedValues = useWatch({
      control,
      name: customFormFields.map(referralField => referralField.name)
    });
    const userSelectedForms = useWatch({ control, name: formsSelectedField, defaultValue: formsSelectedFieldDefault });

    const headerOptions = useOptions({ source: PDF_HEADER_LOOKUP });

    const formSelectorResults = useOptions({
      source: formsSelectedSelector,
      uniqueID: userSelectedForms,
      defaultReturn: fromJS([])
    });

    // eslint-disable-next-line camelcase
    const selectedHeader = headerOptions?.filter(option => option.id === header)?.[0]?.display_text;

    const filteredByFields = formsSelectedSelector ? formSelectorResults?.toJS() : userSelectedForms;

    const selectedForms = filteredByFields?.length
      ? forms.filter(form => filteredByFields.includes(form.unique_id))
      : forms;

    const logos = getLogosToRender(
      agenciesWithLogosEnabled,
      currentUser,
      includeOtherLogos,
      agencyLogosPdf,
      includeImplementationLogos,
      includeAgencyLogos
    );

    useImperativeHandle(ref, () => ({
      savePdf({ setPending, close, values }) {
        setPending(true);
        let worker = html2pdf().set(HTML_2_PDF_OPTIONS(values, data, customFilenameField));
        const pages = Array.from(html.current.childNodes);

        pages.forEach((page, index) => {
          worker = worker
            .from(page)
            .toContainer(index + 1)
            .toCanvas()
            .toPdf()
            .get("pdf")
            .then(async pdf => {
              await addPageHeaderFooter(pdf, mainHeaderRef, secondaryHeaderRef);

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
      <>
        <div ref={mainHeaderRef} className={css.headerContainer}>
          <Logos shortId={record.get("short_id")} logos={logos} css={css} />
          {header && (
            <Typography variant="inherit" component="h2" align="center">
              {selectedHeader}
            </Typography>
          )}
          {customHeader && (
            <Typography variant="inherit" component={!header ? "h2" : "h4"} align="center">
              {customHeader}
            </Typography>
          )}
        </div>
        <div ref={secondaryHeaderRef} className={css.secondaryHeaderContainer}>
          <Logos shortId={record.get("short_id")} logos={logos} css={css} />
        </div>
        <div ref={html} className={css.container}>
          {customFormProps && isRemote && (
            <RenderTable title={title} fields={customFormFields} data={fromJS(watchedValues)} />
          )}
          {selectedForms?.map(form => (
            <RenderTable
              key={`selected-${form.unique_id}`}
              title={i18n.getI18nStringFromObject(form.name)}
              fields={form.fields}
              data={data}
            />
          ))}
          <Signatures types={signatures} />
        </div>
      </>
    );
  }
);

Component.displayName = "PdfExporter";

Component.defaultProps = {
  customFormProps: {}
};

Component.propTypes = {
  agenciesWithLogosEnabled: PropTypes.array,
  agencyLogosPdf: PropTypes.array,
  currentUser: PropTypes.object,
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
  formMethods: PropTypes.object.isRequired,
  forms: PropTypes.object.isRequired,
  formsSelectedField: PropTypes.string,
  formsSelectedFieldDefault: PropTypes.any,
  formsSelectedSelector: PropTypes.string,
  record: PropTypes.object.isRequired
};

export default Component;
