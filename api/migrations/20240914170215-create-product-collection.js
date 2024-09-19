/* eslint-disable @typescript-eslint/no-unused-vars */
module.exports = {
  async up(db, client) {
    // Check if the 'products' collection already exists
    const collectionExists = await db
      .listCollections({ name: 'products' })
      .toArray();
    if (collectionExists.length === 0) {
      // Create the 'products' collection with schema validation
      await db.createCollection('products', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'quantity', 'price', 'shop'],
            properties: {
              name: {
                bsonType: 'string',
                description: 'Name is required and must be a string',
              },
              image: {
                bsonType: 'object',
                properties: {
                  data: {
                    bsonType: 'binData',
                    description: 'Image data',
                  },
                  contentType: {
                    bsonType: 'string',
                    description: 'Content type of the image',
                  },
                },
              },
              description: {
                bsonType: 'string',
                description: 'Optional description for the product',
              },
              category: {
                bsonType: 'string',
                description: 'Category of the product',
              },
              quantity: {
                bsonType: 'number',
                description: 'Quantity is required and must be a number',
              },
              price: {
                bsonType: 'number',
                description: 'Price is required and must be a number',
              },
              shop: {
                bsonType: 'objectId',
                description: 'Shop reference is required',
              },
            },
          },
        },
      });
    }
  },

  async down(db, client) {
    // Drop the 'products' collection
    await db.collection('products').drop();
  },
};
