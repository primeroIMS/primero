import DB from "../db";

const fetchImage = async logo => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.crossOrigin = "Anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.height = image.naturalHeight;
      canvas.width = image.naturalWidth;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(image, 0, 0);

      return resolve(canvas.toDataURL());
    };
    image.onerror = reject;
    image.src = logo;
  });
};

const logoItem = async agency => {
  const logoFull = await fetchImage(agency.logo_full);
  const logoIcon = await fetchImage(agency.logo_icon);

  return {
    id: agency.unique_id,
    images: {
      logo_full: logoFull,
      logo_icon: logoIcon
    }
  };
};

const Logos = {
  find: async () => {
    const logo = await DB.getAll("logos");

    return logo;
  },

  save: async ({ json }) => {
    // TODO: Will add back when we create api endpoint to fetch base64 images
    // const { data } = json;
    // const images = await Promise.all(data.agencies.map(agency => logoItem(agency)));
    // await DB.bulkAdd("logos", images);

    return json;
  }
};

export default Logos;
