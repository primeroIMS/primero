import DB from "../db";

const fetchImage = async logo => {
  const response = await fetch(logo);
  const blob = await response.blob();
  const reader = new FileReader();

  reader.readAsDataURL(blob);

  return new Promise(resolve => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
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
    const { data } = json;

    const images = await Promise.all(data.agencies.map(agency => logoItem(agency)));

    await DB.bulkAdd("logos", images);

    return json;
  }
};

export default Logos;
