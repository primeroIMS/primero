import DB from "../db";

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
