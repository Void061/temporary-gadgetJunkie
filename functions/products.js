// localhost:8888/.netlify/functions/products
const dotenv = require("dotenv");
dotenv.config();

// Connessione ad airtable tramite airtable-node
const Airtable = require("airtable-node");
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE)
  .table(process.env.AIRTABLE_TABLE);

exports.handler = async (event, context, cb) => {
  try {

    const response = await airtable.list({ maxRecords: 200 });
    const products = response.records.map((product) => {
      // Estraiamo da fields tutti i campi, per facilizzarci lato client con la vecchia struttura
      const { id, fields } = product;
      const {
        name,
        featured,
        price,
        colors,
        company,
        description,
        category,
        shipping,
        images,
      } = fields;
      // Mi serve solo l'url, quindi dall'array images prendo la prima che so essere la mia e prendo l'url
      const { url } = images[0];
      return {id, name, featured, price, colors, company, description, category, shipping, image: url}
    });
    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "There was an error",
    };
  }
};
