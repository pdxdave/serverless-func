require('dotenv').config()
const Airtable = require('airtable-node')

// this came from airtable
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base('apphWtePmI4BAUEMP')
  .table('products')


  exports.handler = async (event, context) => {
    const {id} = event.queryStringParameters
    // retrieve is an airtable method
    // this first part is looking for a specific product, if not....
    if(id){
        try {
            const product = await airtable.retrieve(id)
            if(product.error){
                return {
                    statusCode: 404,
                    body: `No product with id ${id}`
                }
            }
            return {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                statusCode: 200,
                body: JSON.stringify(product)
            }
        } catch (error) {
            return {
                statusCode: 500,
                body: `Server Error`
            }
        }
    }
    // ... it will go through the list and grab all the products
    try {
        const {records} = await airtable.list();
        const products = records.map((product) => {
            const {id} = product;
            // all product info is in an object called 'fields'
            const {name, image, price} = product.fields
            const url = image[0].url
            return {id, name, url, price}
        })
        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            statusCode: 200,
            body: JSON.stringify(products)
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: 'server error'
        }
    }
}