/* eslint-disable @typescript-eslint/no-unused-vars */
module.exports = {
  async up(db, client) {
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
  },

  async down(db, client) {
    // Drop CartItem collection
    await db.collection('cartitems').drop();
  },
};
