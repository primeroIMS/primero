import domtoimage from "dom-to-image-more";

export const NAME = "CodeOfConduct";
export const ID = "id";
export const CODE_OF_CONDUCT_DATE_FORMAT = "MMMM dd, yyyy";
export const PDF_OPTIONS = {
  margin: 1,
  filename: "code-of-conduct.pdf",
  image: { type: "png", quality: 1 },
  renderer: {
    class: domtoimage,
    method: "toCanvas",
    options: {
      ...{ scale: window.devicePixelRatio || 1 },
      quality: 1,
      style: {
        display: "block"
      }
    }
  },
  jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
};
