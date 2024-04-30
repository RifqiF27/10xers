# API Documentation

## User Endpoints

### Register User

- **URL:** `http://localhost:3000/register`
- **Method:** `POST`
- **Description:** Register a new user
- **Request Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  - Status: `201 Created`
  - Body:
    ```json
    {
      "access_token": "string",
      "message": "User with id {user_id} has been created"
    }
    ```

### Login User

- **URL:** `http://localhost:3000/login`
- **Method:** `POST`
- **Description:** Login an existing user
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  - Status: `200 OK`
  - Body:
    ```json
    {
      "access_token": "string"
    }
    ```

## Product Endpoints

### Add Product

- **URL:** `http://localhost:3000/add-product`
- **Method:** `POST`
- **Description:** Add a new product
- **Request Body:**
  ```json
  {
    "name": "string",
    "color": "string",
    "price": "integer",
    "description": "string",
    "stock": "integer",
    "imgUrl": "string"
  }
  ```
- **Headers:**

  ```json
  {
    "access_token": "string"
  }
  ```

- **Response:**
  - Status: `201 Created`
  - Body: Product object

### View All Products

- **URL:** `http://localhost:3000/view-products`
- **Method:** `GET`
- **Description:** View all products with optional search by name
- **Query Parameters:**
  - `name`: Search by product name
- **Request Headers:**
  ```json
  {
    "access_token": "string"
  }
  ```
- **Response:**

  - Status: `200 OK`
  - Body:

    ```json
    {
      [
        // Array of product objects
      ]
    }
    ```

- **URL:** `http://localhost:3000/public/products?page=1&itemsPage=3&name=`
- **Method:** `GET`
- **Description:** View all products with optional pagination and search by name
- **Query Parameters:**
  - `page`: Page number (default: 1)
  - `itemsPage`: Number of items per page (default: 3)
  - `name`: Search by product name
- **Response:**
  - Status: `200 OK`
  - Body:
    ```json
    {
      "Products": [
        // Array of product objects
      ],
      "totalPage": "number"
    }
    ```

### View One Product

- **URL:** `http://localhost:3000/public/product/:id`
- **Method:** `GET`
- **Description:** View details of a single product
- **Path Parameters:**
  - `id`: Product ID
- **Response:**
  - Status: `200 OK`
  - Body: Product object

### Edit Product

- **URL:** `http://localhost:3000/edit-product/:id`
- **Method:** `PUT`
- **Description:** Update details of an existing product
- **Path Parameters:**
  - `id`: Product ID
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "price": "number"
  }
  ```
- **Headers:**
  ```json
  {
    "access_token": "string"
  }
- **Response:**
  - Status: `200 OK`
  - Body:
    ```json
    {
      "message": "Product has been updated"
    }
    ```


### Delete Product

- **URL:** `http://localhost:3000/delete-product/:id`
- **Method:** `DELETE`
- **Description:** Delete an existing product
- **Path Parameters:**
  - `id`: Product ID
- **Request Headers:**
  ```json
  {
    "access_token": "string"
  }
- **Response:**
  - Status: `200 OK`
  - Body:
    ```json
    {
      "message": "Delete success"
    }
    ```

---

Make sure to replace `{access_token}` with a valid token when accessing endpoints that require authorization.
