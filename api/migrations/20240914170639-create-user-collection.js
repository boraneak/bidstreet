/* eslint-disable @typescript-eslint/no-unused-vars */
module.exports = {
  async up(db, client) {
    // Check if the 'users' collection already exists
    const collectionExists = await db
      .listCollections({ name: 'users' })
      .toArray();
    if (collectionExists.length === 0) {
      // Create the 'users' collection with schema validation
      await db.createCollection('users', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'email', 'hashed_password'],
            properties: {
              name: {
                bsonType: 'string',
                description: 'Name is required and must be a string',
              },
              email: {
                bsonType: 'string',
                description:
                  'Email is required and must be a valid email address',
              },
              hashed_password: {
                bsonType: 'string',
                description: 'Hashed password is required',
              },
              salt: {
                bsonType: 'string',
                description: 'Salt for password hashing',
              },
              seller: {
                bsonType: 'bool',
                description: 'Boolean indicating if the user is a seller',
              },
            },
          },
        },
      });
    }
  },

  async down(db, client) {
    // Drop the 'users' collection
    await db.collection('users').drop();
  },
};
