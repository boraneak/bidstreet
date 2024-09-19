/* eslint-disable @typescript-eslint/no-unused-vars */
module.exports = {
  async up(db, client) {
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
  },

  async down(db, client) {
    // Drop the 'shops' collection
    await db.collection('shops').drop();
  },
};
