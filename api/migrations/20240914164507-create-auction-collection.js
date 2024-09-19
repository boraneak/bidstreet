/* eslint-disable @typescript-eslint/no-unused-vars */
module.exports = {
  async up(db, client) {
    const collections = await db
      .listCollections({ name: 'auctions' })
      .toArray();
    if (collections.length === 0) {
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
                  data: {
                    bsonType: 'binData',
                  },
                  contentType: {
                    bsonType: 'string',
                  },
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
  },

  async down(db, client) {
    // Rollback - drop the Auction collection if it exists
    await db.collection('auctions').drop();
  },
};
