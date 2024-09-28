/* eslint-disable @typescript-eslint/no-unused-vars */
const { faker } = require('@faker-js/faker');
const { ObjectId } = require('mongodb');

module.exports = {
  async up(db, client) {
    try {
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

      // Seed 500 dummy users
      const users = [];
      for (let i = 0; i < 500; i++) {
        users.push({
          _id: new ObjectId(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          hashed_password: faker.internet.password(),
          salt: faker.string.alphanumeric(10),
          seller: faker.datatype.boolean(),
        });
      }

      await db.collection('users').insertMany(users);
      console.log('500 users have been seeded.');
    } catch (error) {
      console.error('Error during migration:', error);
    }
  },

  async down(db, client) {
    try {
      // Drop the 'users' collection
      await db.collection('users').drop();
      console.log('Users collection has been dropped.');
    } catch (error) {
      console.error('Error during rollback:', error);
    }
  },
};
