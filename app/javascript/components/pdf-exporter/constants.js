/* eslint-disable import/prefer-default-export */
import domtoimage from "dom-to-image-more";

export const PAGE_MARGIN = 0.5;

export const DEFAULT_RENDERER_OPTIONS = Object.freeze({ scale: window.devicePixelRatio || 1 });

export const HTML_2_PDF_OPTIONS = (values, record, customFilenameField) => ({
  filename: `${values[customFilenameField] || record.get("id")}.pdf`,
  margin: [1.5, PAGE_MARGIN, 1, PAGE_MARGIN],
  image: {
    type: "png",
    quality: 1
  },
  renderer: {
    class: domtoimage,
    method: "toCanvas",
    options: {
      ...DEFAULT_RENDERER_OPTIONS,
      quality: 1,
      style: {
        display: "block"
      }
    }
  },
  pagebreak: {
    mode: "avoid-all"
  },
  jsPDF: {
    unit: "in",
    format: "letter",
    orientation: "portrait"
  }
});

export const PDF_HEADER_LOOKUP = "lookup-pdf-header";
