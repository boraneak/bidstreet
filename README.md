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

## Technology Stack

### Backend

- **[Express.js](https://expressjs.com/) with [TypeScript](https://www.typescriptlang.org/)**: Core server-side framework for handling HTTP requests and API routing.
- **[Multer](https://github.com/expressjs/multer)**: Middleware solution for efficient management of file uploads.
- **[JSON Web Tokens (JWT)](https://jwt.io/)**: Implementation of secure user authentication and authorization protocols.
- **[MongoDB](https://www.mongodb.com/)**: NoSQL database system for flexible and scalable data storage.
- **[Mongoose](https://mongoosejs.com/)**: Object Data Modeling (ODM) library for MongoDB, facilitating structured database interactions.

### Frontend

- **[React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)**: Primary library for building the user interface, enhanced with static typing.
- **[Material-UI](https://mui.com/)**: Comprehensive library of pre-designed React components for rapid UI development.
- **[React Router](https://reactrouter.com/en/main)**: Declarative routing solution for seamless navigation within the React application.
- **[Axios](https://axios-http.com/)**: Promise-based HTTP client for streamlined communication between frontend and backend services.

### Development Tools

- **[Swagger](https://swagger.io/)**: OpenAPI specification tool for comprehensive API documentation and testing.

## Contributing

We welcome contributions that improve the project! If you have suggestions, bug reports, or would like to contribute code:

0. Fork the repository.
1. Create your feature branch: `git checkout -b feature/new-feature`.
2. Commit your changes: `git commit -am 'Add new feature'`.
3. Push to the branch: `git push origin feature/new-feature`.
4. Submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
