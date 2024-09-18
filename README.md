# Bidding web app (🚧 In Progress)

[![CodeQL](https://github.com/boraneak/bidstreet/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/boraneak/bidstreet/actions/workflows/github-code-scanning/codeql) <br>

This project is an online bidding platform where users can create shops, list items for auction, and bid on products securely. It features user management, product listings, and auction handling, with robust authentication and authorization for a seamless and efficient experience for both buyers and sellers.

## Getting Started

To run the project locally:

0. Clone the Repository

```
git clone git@github.com:boraneak/bidstreet.git
```

1. Set up the api

- <a href="https://github.com/boraneak/bidstreet/tree/master/api" target="_blank" rel="noopener noreferrer">API</a>

2. Set up the web

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
- **[Prettier](https://prettier.io/)**: Code formatter to enforce a consistent style across the project.

## Code Formatting

This project uses **Prettier** for code formatting. The following scripts are available:

- To format the codebase, run:

```
yarn prettier
```

- To check if the code is correctly formatted, run:

```
yarn prettier:check
```

## Contributing

We welcome contributions that improve the project! If you have suggestions, bug reports, or would like to contribute code:

0. Fork the repository.

1. Create your feature branch.

```
git checkout -b feature/new-feature
```

3. Commit your changes.

```
git commit -am 'Add new feature'
```

4. Push to the branch.

```
git push origin feature/new-feature
```

5. Submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
