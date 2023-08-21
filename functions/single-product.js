//localhost:8888/.netlify/functions/single-product
const dotenv = require("dotenv");
dotenv.config();

// Connessione ad airtable tramite airtable-node
const Airtable = require("airtable-node");
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE)
  .table(process.env.AIRTABLE_TABLE);


exports.handler = async (event, context, cb) => {

  const { id } = event.queryStringParameters;

  if (id) {
    try {
      let product = await airtable.retrieve(id)
      product = { id: product.id, ...product.fields}
      
      if(product.error){
        return{
          statusCode: 404,
          body: `No product with id : ${id}`
        }
      }

      return{
        statusCode: 200,
        body: JSON.stringify(product)
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: "Server error",
      };
    }
  }
  return {
    statusCode: 500,
    body: "Please provide product id",
  };
};
