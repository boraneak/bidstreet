/* eslint-disable @typescript-eslint/no-unused-vars */
const { faker } = require('@faker-js/faker');
const { ObjectId } = require('mongodb');

module.exports = {
  async up(db, client) {
    try {
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

      // Seed 500 dummy products
      const products = [];
      for (let i = 0; i < 500; i++) {
        products.push({
          _id: new ObjectId(),
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          category: faker.commerce.department(),
          quantity: faker.number.int({ min: 1, max: 100 }),
          price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
          shop: new ObjectId(), // Assuming valid ObjectId values for shops
          image: {
            data: Buffer.from('default image data here'), // Default image data as a buffer
            contentType: 'image/png', // Default content type
          },
        });
      }

      await db.collection('products').insertMany(products);
      console.log('500 products have been seeded.');
    } catch (error) {
      console.error('Error during migration:', error);
    }
  },

  async down(db, client) {
    try {
      // Drop the 'products' collection
      await db.collection('products').drop();
      console.log('Products collection has been dropped.');
    } catch (error) {
      console.error('Error during rollback:', error);
    }
  },
};
