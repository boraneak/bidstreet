/* eslint-disable @typescript-eslint/no-unused-vars */
const { faker } = require('@faker-js/faker');
const { ObjectId } = require('mongodb');

module.exports = {
  async up(db, client) {
    try {
      // Check if the 'auctions' collection already exists
      const collections = await db
        .listCollections({ name: 'auctions' })
        .toArray();

      if (collections.length === 0) {
        // Create the 'auctions' collection with schema validation
        await db.createCollection('auctions', {
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              required: ['itemName', 'bidEnd', 'seller', 'startingBid'],
              properties: {
                itemName: {
                  bsonType: 'string',
                  description: 'Item name is required and must be a string',
                },
                description: {
                  bsonType: 'string',
                  description: 'Optional description for the auction',
                },
                image: {
                  bsonType: 'object',
                  properties: {
                    data: { bsonType: 'binData' },
                    contentType: { bsonType: 'string' },
                  },
                },
                bidStart: {
                  bsonType: 'date',
                  description: 'Bid start time, defaults to now',
                },
                bidEnd: {
                  bsonType: 'date',
                  description: 'Bid end time is required and must be a date',
                },
                seller: {
                  bsonType: 'objectId',
                  description: 'Seller is required and must be a valid user',
                },
                startingBid: {
                  bsonType: 'number',
                  description: 'Starting bid, defaults to 0',
                },
                bids: {
                  bsonType: 'array',
                  items: {
                    bsonType: 'object',
                    required: ['bidder', 'bid', 'time'],
                    properties: {
                      bidder: {
                        bsonType: 'objectId',
                        description: 'Bidder must be a valid user ID',
                      },
                      bid: {
                        bsonType: 'number',
                        description: 'Bid value must be a number',
                      },
                      time: {
                        bsonType: 'date',
                        description: 'Bid time must be a date',
                      },
                    },
                  },
                },
              },
            },
          },
        });
      }

      // Seed 500 dummy auctions
      const auctions = [];
      for (let i = 0; i < 500; i++) {
        const randomBidsCount = faker.number.int({ min: 0, max: 10 });
        const randomBids = Array.from({ length: randomBidsCount }, () => ({
          bidder: new ObjectId(), // Update this to reference existing users if needed
          bid: parseFloat(faker.finance.amount(10, 1000, 2)),
          time: faker.date.recent(),
        }));

        auctions.push({
          _id: new ObjectId(),
          itemName: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          image: {
            data: Buffer.from('default image data here'),
            contentType: 'image/png',
          },
          bidStart: faker.date.past(),
          bidEnd: faker.date.future(),
          seller: new ObjectId(), // Update this to reference existing users if needed
          startingBid: parseFloat(faker.finance.amount(50, 500, 2)),
          bids: randomBids,
        });
      }

      await db.collection('auctions').insertMany(auctions);
      console.log('500 auctions have been seeded.');
    } catch (error) {
      console.error('Error during migration or seeding:', error);
    }
  },

  async down(db, client) {
    // Rollback - drop the 'auctions' collection if it exists
    await db.collection('auctions').drop();
  },
};
