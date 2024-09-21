/* eslint-disable @typescript-eslint/no-unused-vars */
module.exports = {
  async up(db, client) {
    // Create the Order collection
    const orderExists = await db.listCollections({ name: 'orders' }).toArray();
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
  },

  async down(db, client) {
    // Drop Order collection
    await db.collection('orders').drop();
  },
};
