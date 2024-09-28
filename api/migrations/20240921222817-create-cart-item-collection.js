/* eslint-disable @typescript-eslint/no-unused-vars */
const { faker } = require('@faker-js/faker');
const { ObjectId } = require('mongodb');

module.exports = {
  async up(db, client) {
    try {
      // Create the CartItem collection
      const cartItemExists = await db
        .listCollections({ name: 'cartitems' })
        .toArray();

      if (cartItemExists.length === 0) {
        await db.createCollection('cartitems', {
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              required: ['product', 'quantity', 'shop'],
              properties: {
                product: {
                  bsonType: 'objectId',
                  description: 'Product reference is required',
                },
                quantity: {
                  bsonType: 'number',
                  description: 'Quantity is required and must be a number',
                },
                shop: {
                  bsonType: 'objectId',
                  description: 'Shop reference is required',
                },
                status: {
                  bsonType: 'string',
                  enum: [
                    'Not processed',
                    'Processing',
                    'Shipped',
                    'Delivered',
                    'Cancelled',
                  ],
                  description: 'Status of the cart item',
                },
              },
            },
          },
        });
      }

      // Seed 500 dummy cart items
      const cartItems = [];
      const statuses = [
        'Not processed',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled',
      ];

      for (let i = 0; i < 500; i++) {
        cartItems.push({
          product: new ObjectId(), // Assuming random valid product references
          quantity: faker.number.int({ min: 1, max: 10 }), // Random quantity between 1 and 10
          shop: new ObjectId(), // Assuming random valid shop references
          status:
            statuses[faker.number.int({ min: 0, max: statuses.length - 1 })], // Random status
        });
      }

      await db.collection('cartitems').insertMany(cartItems);
      console.log('500 cart items have been seeded.');
    } catch (error) {
      console.error('Error during migration:', error);
    }
  },

  async down(db, client) {
    try {
      // Drop CartItem collection
      await db.collection('cartitems').drop();
      console.log('CartItems collection has been dropped.');
    } catch (error) {
      console.error('Error during rollback:', error);
    }
  },
};
