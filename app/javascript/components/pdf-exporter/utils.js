import domtoimage from "dom-to-image-more";
import isEmpty from "lodash/isEmpty";
import uniqBy from "lodash/uniqBy";

import { DEFAULT_RENDERER_OPTIONS, PAGE_MARGIN } from "./constants";

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

const getOthersAgencyLogos = (includeOtherLogos, agencyLogosPdf) => {
  if (!includeOtherLogos || !agencyLogosPdf) {
    return [];
  }

  return agencyLogosPdf
    .filter(agency => includeOtherLogos.includes(agency.get("id")))
    .reduce((accum, curr) => [...accum, { name: curr.get("name"), logoFull: curr.getIn(["images", "logo_full"]) }], []);
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

export const addPageHeaderFooter = async (pdf, mainHeaderRef, secondaryHeaderRef) => {
  const mainHeaderHtml = mainHeaderRef.current;
  const secondaryHeaderHtml = secondaryHeaderRef.current;

  mainHeaderHtml.style.display = "block";
  secondaryHeaderHtml.style.display = "block";
  const totalPages = pdf.internal.getNumberOfPages();
  const pageContentWidth = pdf.internal.pageSize.getWidth() - PAGE_MARGIN;
  const pageContentHeight = pdf.internal.pageSize.getHeight() - PAGE_MARGIN;
  const mainHeaderImage = await domtoimage.toPng(mainHeaderHtml, DEFAULT_RENDERER_OPTIONS);
  const secondaryHeaderImage = await domtoimage.toPng(secondaryHeaderHtml, DEFAULT_RENDERER_OPTIONS);

  for (let page = 1; page <= totalPages; page += 1) {
    pdf.setPage(page);

    // Add case id and date
    pdf.addImage(
      page === 1 ? mainHeaderImage : secondaryHeaderImage,
      "png",
      PAGE_MARGIN,
      PAGE_MARGIN,
      pageContentWidth - 0.5,
      1.5
    );

    // Add page numbers
    pdf.setFontSize(10);
    pdf.text(`${page}`, PAGE_MARGIN, pageContentHeight);
  }
};

export const getLogosToRender = (
  agencies,
  user,
  includeOtherLogos,
  agencyLogosPdf,
  includeImplementationLogos,
  includeUserAgencyLogos
) => {
  if (!includeImplementationLogos && !includeUserAgencyLogos && isEmpty(includeOtherLogos)) {
    return [];
  }
  const implementationLogos =
    (includeImplementationLogos &&
      agencies.reduce(
        (accum, curr) => [...accum, { name: curr.get("name"), logoFull: curr.getIn(["images", "logo_full"]) }],
        []
      )) ||
    [];
  const userLogos = (includeUserAgencyLogos && [{ logoFull: user.getIn(["agencyLogo", "images", "logo_full"]) }]) || [];
  const othersAgencyLogos = getOthersAgencyLogos(includeOtherLogos, agencyLogosPdf);

  const logos = implementationLogos.concat(userLogos).concat(othersAgencyLogos);

  return uniqBy(logos, "logoFull");
};
