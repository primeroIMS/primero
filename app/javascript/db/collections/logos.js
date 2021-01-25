import DB from "../db";

const fetchImage = async logo => {
  const response = await fetch(logo);
  const imageBlob = await response.blob();
  const reader = new FileReader();

  reader.readAsDataURL(imageBlob);

  return new Promise(resolve => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};

const logoItem = async agency => {
  try {
    const { logo_full: logoFull, logo_icon: logoIcon } = agency;

    if (!logoFull || !logoIcon) return false;

    const logoFullProcessed = await fetchImage(logoFull);
    const logoIconProcessed = await fetchImage(logoIcon);

    return {
      id: agency.unique_id,
      name: agency.name,
      images: {
        logo_full: logoFullProcessed,
        logo_icon: logoIconProcessed
      }
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Error converting logo for agency ${agency.agency_code}`);

    return false;
  }
};

const Logos = {
  find: async () => {
    const logo = await DB.getAll("logos");

    return logo;
  },

  save: async json => {
    const logos = await Promise.all(json.map(agency => logoItem(agency)));
    const filteredLogos = logos?.filter(agency => agency);

    if (filteredLogos) {
      await DB.bulkAdd("logos", filteredLogos);
    }

    return filteredLogos;
  }
};

export default Logos;
