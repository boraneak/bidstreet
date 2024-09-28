/* eslint-disable @typescript-eslint/no-unused-vars */
const { faker } = require('@faker-js/faker');
const { ObjectId } = require('mongodb');

module.exports = {
  async up(db, client) {
    try {
      // Create the Order collection
      const orderExists = await db
        .listCollections({ name: 'orders' })
        .toArray();
      if (orderExists.length === 0) {
        await db.createCollection('orders', {
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              required: [
                'customer_name',
                'customer_email',
                'delivery_address',
                'user',
              ],
              properties: {
                products: {
                  bsonType: 'array',
                  items: {
                    bsonType: 'object',
                    required: ['product', 'quantity', 'shop'],
                    properties: {
                      product: {
                        bsonType: 'objectId',
                        description: 'Product reference is required',
                      },
                      quantity: {
                        bsonType: 'number',
                        description:
                          'Quantity is required and must be a number',
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
                customer_name: {
                  bsonType: 'string',
                  description: 'Customer name is required',
                },
                customer_email: {
                  bsonType: 'string',
                  description: 'Customer email is required and must be valid',
                },
                delivery_address: {
                  bsonType: 'object',
                  required: ['street', 'city', 'zipcode', 'country'],
                  properties: {
                    street: {
                      bsonType: 'string',
                      description: 'Street address is required',
                    },
                    city: {
                      bsonType: 'string',
                      description: 'City is required',
                    },
                    state: {
                      bsonType: 'string',
                      description: 'State is optional',
                    },
                    zipcode: {
                      bsonType: 'string',
                      description: 'Zip code is required',
                    },
                    country: {
                      bsonType: 'string',
                      description: 'Country is required',
                    },
                  },
                },
                payment_id: {
                  bsonType: 'string',
                  description: 'Payment ID is optional',
                },
                user: {
                  bsonType: 'objectId',
                  description: 'User reference is required',
                },
              },
            },
          },
        });
      }

      // Seed 500 dummy orders
      const orders = [];
      const statuses = [
        'Not processed',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled',
      ];

      for (let i = 0; i < 500; i++) {
        const products = [];

        // Generating 1 to 5 random products per order
        const numberOfProducts = faker.number.int({ min: 1, max: 5 });
        for (let j = 0; j < numberOfProducts; j++) {
          products.push({
            product: new ObjectId(), // Assuming random valid product references
            quantity: faker.number.int({ min: 1, max: 10 }), // Random quantity between 1 and 10
            shop: new ObjectId(), // Assuming random valid shop references
            status:
              statuses[faker.number.int({ min: 0, max: statuses.length - 1 })], // Random status
          });
        }

        orders.push({
          _id: new ObjectId(),
          products,
          customer_name: faker.person.fullName(),
          customer_email: faker.internet.email(),
          delivery_address: {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipcode: faker.location.zipCode(),
            country: faker.location.country(),
          },
          payment_id: faker.string.uuid(), // Assuming a UUID for payment ID
          user: new ObjectId(), // Assuming random valid user references
        });
      }

      // Insert orders into the database
      try {
        await db.collection('orders').insertMany(orders);
        console.log('500 orders have been seeded.');
      } catch (error) {
        console.error('Error inserting orders:', error);
      }
    } catch (error) {
      console.error('Error during migration:', error);
    }
  },

  async down(db, client) {
    try {
      // Drop Order collection
      await db.collection('orders').drop();
      console.log('Orders collection has been dropped.');
    } catch (error) {
      console.error('Error during rollback:', error);
    }
  },
};
