/* eslint-disable import/prefer-default-export */

import { PAGE_MARGIN } from "./constants";

const getImageDimensions = async base64 => {
  const image = new Image();

  return new Promise(resolve => {
    image.src = base64;
    image.onload = () => {
      const { width, height } = image;

      resolve({ width, height });
    };
  });
};

export const buildHeaderImage = async img => {
  try {
    const { height, width } = await getImageDimensions(img);
    const maxWidth = 130;
    const maxHeight = 50;
    const ratio = Math.min(maxWidth / width, maxHeight / height);

    return {
      img,
      width: (width * ratio) / 72,
      height: (height * ratio) / 72
    };
  } catch {
    return {};
  }
};

export const addPageHeaderFooter = (pdf, record, i18n) => {
  const totalPages = pdf.internal.getNumberOfPages();
  const pageContentWidth = pdf.internal.pageSize.getWidth() - PAGE_MARGIN;
  const pageContentHeight = pdf.internal.pageSize.getHeight() - PAGE_MARGIN;

  const addPageMeta = (fontSize = 9, x = pageContentWidth, yCaseID = 0.5, yDate = 0.7, align = "right") => {
    pdf.setFontType("bold");
    pdf.setFontSize(fontSize);
    pdf.text(i18n.t("cases.show_case", { short_id: record.get("short_id") }), x, yCaseID, { align });
    pdf.setFontType("normal");
    pdf.text(i18n.t("exports.printed", { date: i18n.l("date.formats.default", new Date()) }), x, yDate, { align });
  };

  for (let page = 1; page <= totalPages; page += 1) {
    pdf.setPage(page);

    // TODO: Will add back when we create api endpoint to fetch base64 images
    // if (logo?.img) {
    //   pdf.addImage(logo?.img, "png", PAGE_MARGIN, PAGE_MARGIN, logo?.width, logo?.height);
    // }

    // Add case id and date
    if (page === 1) {
      addPageMeta(11.5, PAGE_MARGIN, 0.5, 0.7, "left");
    } else {
      addPageMeta();
    }

    // Add page numbers
    pdf.setFontSize(10);
    pdf.text(`${page}`, PAGE_MARGIN, pageContentHeight);
  }
};
