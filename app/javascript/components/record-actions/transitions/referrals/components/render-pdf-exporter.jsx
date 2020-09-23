import React from "react";

import PdfExporter from "../../../../pdf-exporter";
import { CUSTOM_EXPORT_FILE_NAME_FIELD } from "../constants";

const renderPdfExporter = ({ record, recordTypesForms, pdfExporterRef }) => values => {
  if (!values?.remoteSystem) {
    return false;
  }

  return (
    <PdfExporter
      record={record}
      forms={recordTypesForms}
      ref={pdfExporterRef}
      customFilenameField={CUSTOM_EXPORT_FILE_NAME_FIELD}
    />
  );
};

export default renderPdfExporter;
