# Bidding web app (🚧 In Progress)
[![CodeQL](https://github.com/boraneak/bidstreet/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/boraneak/bidstreet/actions/workflows/github-code-scanning/codeql) <br>
This project is mainly about letting people bid on different items in an online store.

## Getting Started

To run the project locally:
```
# Clone the repo
git@github.com:boraneak/bidstreet.git
```
- <a href="https://github.com/boraneak/bidstreet/tree/master/api" target="_blank" rel="noopener noreferrer">API</a>
- <a href="https://github.com/boraneak/bidstreet/tree/master/web" target="_blank" rel="noopener noreferrer">Web</a>

## Features

#### Authentication

- Provides sign-in and sign-out functionality.
- Implements user authentication and authorization using JWT tokens.

#### User Management

- Allows creation, updating, and deletion of user accounts.
- Supports retrieval of user profiles and listings of all users.

#### Shop Management

- Enables users to create, update, and delete their shops.
- Provides endpoints for fetching all shops and shops by owner.

#### Product Management

- Allows users to create, update, and delete products within their shops.
- Supports various product operations like retrieving product details, uploading product photos, and fetching - products by shop.

#### Auction Management

- Offers functionality for managing auctions.
- Provides endpoints for auction creation and retrieval.

## Tech Stack

- [Express.js](https://expressjs.com/) with [TypeScript](https://www.typescriptlang.org/) : Used as the backend framework to handle HTTP requests.
- [Multer](https://github.com/expressjs/multer): Middleware for handling file uploads.
- [JWT](https://jwt.io/): Used for user authentication and authorization.
- [MongoDB](https://www.mongodb.com/): Database for storing application data.
- [Mongoose](https://mongoosejs.com/): ODM for MongoDB, used for database interactions.
- [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- [Material-UI](https://mui.com/) for read-to-use React components
- [React Router](https://reactrouter.com/en/main) for routing
- [Axios](https://axios-http.com/): HTTP client for making requests from the frontend to the backend.
- [Swagger](https://swagger.io/) for API documentation

## Contributing

We welcome contributions that improve the project! If you have suggestions, bug reports, or would like to contribute code:

0. Fork the repository.
1. Create your feature branch: `git checkout -b feature/new-feature`.
2. Commit your changes: `git commit -am 'Add new feature'`.
3. Push to the branch: `git push origin feature/new-feature`.
4. Submit a pull request.
