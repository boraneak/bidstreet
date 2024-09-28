/* eslint-disable @typescript-eslint/no-unused-vars */
const { faker } = require('@faker-js/faker');
const { ObjectId } = require('mongodb');

module.exports = {
  async up(db, client) {
    try {
      // Check if the 'shops' collection already exists
      const collectionExists = await db
        .listCollections({ name: 'shops' })
        .toArray();

      if (collectionExists.length === 0) {
        // Create the 'shops' collection with schema validation
        await db.createCollection('shops', {
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              required: ['name'],
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
                  description: 'Optional description for the shop',
                },
                owner: {
                  bsonType: 'objectId',
                  description: 'Owner reference is optional',
                },
              },
            },
          },
        });
      }

      // Seed 500 dummy shops
      const shops = [];
      for (let i = 0; i < 500; i++) {
        shops.push({
          _id: new ObjectId(),
          name: faker.company.name(),
          description: faker.company.catchPhrase(),
          owner: new ObjectId(), // Assuming valid ObjectId values for shop owners
          image: {
            data: Buffer.from('default image data here'), // Default image data as a buffer
            contentType: 'image/png', // Default content type
          },
        });
      }

      await db.collection('shops').insertMany(shops);
      console.log('500 shops have been seeded.');
    } catch (error) {
      console.error('Error during migration:', error);
    }
  },

  async down(db, client) {
    try {
      // Drop the 'shops' collection
      await db.collection('shops').drop();
      console.log('Shops collection has been dropped.');
    } catch (error) {
      console.error('Error during rollback:', error);
    }
  },
};
