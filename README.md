# FreshMart

FreshMart is a full-stack online grocery store built with React, Vite, Express, MongoDB, and Razorpay. It supports product browsing, category filtering, search, wishlist, cart, online checkout, customer order tracking, and an admin dashboard for managing store data.

The project is split into two apps:

- `client/` - React frontend built with Vite and Tailwind CSS.
- `server/` - Express API connected to MongoDB through Mongoose.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How The App Works](#how-the-app-works)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Database Models](#database-models)
- [Admin Access](#admin-access)
- [Deployment Notes](#deployment-notes)
- [Important Notes](#important-notes)
- [Future Improvements](#future-improvements)

## Features

### Customer Features

- Home page with hero banner, popular categories, fresh picks, best-selling items, and latest products.
- Shop page with product search, category filters, sorting, and price range filtering.
- Product detail page with stock status, description, wishlist toggle, and cart controls.
- Cart with quantity controls, subtotal calculation, remove item, and clear cart.
- Wishlist stored in `localStorage` for quick access to loved products.
- User authentication with register, login, logout, and JWT storage.
- Profile page with editable name, gender, delivery address, and profile photo preview.
- Checkout flow with Razorpay payment order creation, payment verification, and order creation.
- Order history page with order items, delivery address, current status, and timeline tracking.
- Static support pages for About, Policy, FAQs, and Help & Support.

### Admin Features

- Admin-only frontend route guard based on `user.role === "admin"`.
- Dashboard overview for total orders, revenue, users, products, pending orders, delivered orders, paid revenue, and low stock products.
- Detailed dashboard tables for orders, users, products, revenue by payment status, and revenue by category.
- Product management page to create products, create categories, and delete products.
- Order management page to view orders and update status through the lifecycle:
  `pending`, `processing`, `shipped`, `delivered`, `cancelled`.

### Backend Features

- Express REST API with separate routes for users, products, categories, orders, and payments.
- MongoDB models for users, categories, products, and orders.
- JWT authentication middleware.
- Backend admin middleware for selected admin-only API access.
- Razorpay order creation and payment signature verification.
- Order stock deduction for database-backed products.
- Order item snapshots so static or fallback products can still appear in order history.
- Health check endpoint with database readiness status.
- Database readiness middleware that returns a `503` response when MongoDB is unavailable.

## Tech Stack

### Frontend

- React 19
- Vite 8
- React Router DOM 7
- Axios
- Tailwind CSS 4
- Context API for auth, cart, and wishlist state

### Backend

- Node.js
- Express 5
- MongoDB
- Mongoose
- JSON Web Tokens
- bcryptjs
- Razorpay Node SDK
- dotenv
- cors
- nodemon

## Project Structure

```text
freshmart/
|-- client/
|   |-- public/
|   |   |-- hero/
|   |   |-- product-images/
|   |   `-- store/
|   |-- src/
|   |   |-- components/
|   |   |   |-- Layout/
|   |   |   `-- products/
|   |   |-- context/
|   |   |-- Pages/
|   |   |   `-- admin/
|   |   |-- services/
|   |   |-- utils/
|   |   |-- App.jsx
|   |   `-- main.jsx
|   |-- index.html
|   |-- package.json
|   |-- vercel.json
|   `-- vite.config.js
|-- server/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- seed.js
|   |-- server.js
|   `-- package.json
|-- package.json
`-- README.md
```

## How The App Works

### Frontend Flow

`client/src/main.jsx` wraps the app with three providers:

- `AuthProvider` stores the logged-in user and token.
- `WishlistProvider` stores loved products in `localStorage`.
- `CartProvider` stores cart items and totals in React state.

`client/src/App.jsx` defines the route map. Public routes include home, shop, deals, fresh produce, product detail, login, cart, checkout, and static pages. Protected routes include profile and order history. Admin routes are wrapped with an `AdminRoute` component that checks the logged-in user's role.

API requests go through `client/src/services/api.js`, which creates an Axios instance and attaches the JWT token from `localStorage` as a Bearer token.

### Customer Order Flow

1. User browses products from home, shop, categories, deals, or product detail.
2. User adds products to the cart.
3. User goes to checkout and enters a delivery address.
4. Frontend calls `POST /api/payment/create-order`.
5. Razorpay Checkout opens in the browser.
6. Razorpay returns payment details to the frontend handler.
7. Frontend calls `POST /api/payment/verify`.
8. After successful verification, frontend calls `POST /api/orders`.
9. Backend saves the order, deducts product stock when applicable, and stores a status timeline.
10. User can view the order in `/orders`.

### Admin Flow

1. Admin logs in with a user account whose role is `admin`.
2. Admin can open `/admin`, `/admin/products`, and `/admin/orders`.
3. Dashboard loads orders, products, and users to calculate business metrics.
4. Admin can add products, add categories, delete products, and update order statuses.
5. Status changes are stored in each order's `statusTimeline`.

### Image And Unit Helpers

The frontend uses:

- `client/src/utils/productImage.js` to map product names to local images or fall back to category images.
- `client/src/utils/productUnit.js` to infer units such as `per kg`, `per dozen`, `per litre`, or `per pack`.

These utilities help static fallback products and database products render consistently.

## Getting Started

### Prerequisites

Install these before running the project:

- Node.js
- npm
- MongoDB Atlas account or a local MongoDB database
- Razorpay test account

### 1. Clone The Repository

```bash
git clone <your-repository-url>
cd freshmart
```

### 2. Install Dependencies

Install dependencies for the root scripts, backend, and frontend:

```bash
npm install
cd server
npm install
cd ../client
npm install
```

### 3. Configure The Backend

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 4. Configure The Frontend API URL

The current Axios client points to the hosted API:

```js
baseURL: 'https://freshmart-0the.onrender.com/api'
```

For local backend development, update `client/src/services/api.js` to:

```js
baseURL: 'http://localhost:5000/api'
```

A cleaner production improvement is to move this value into a Vite environment variable such as `VITE_API_URL`.

### 5. Seed Sample Data

The seed script creates grocery categories and products.

```bash
cd server
node seed.js
```

The script clears existing products and categories before inserting seed data.

### 6. Run The Backend

From the repository root:

```bash
npm run dev:server
```

The API runs on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

### 7. Run The Frontend

Open another terminal from the repository root:

```bash
npm run dev:client
```

The Vite app runs on:

```text
http://127.0.0.1:5173
```

## Environment Variables

### Backend

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | Server port. Defaults to `5000`. |
| `MONGO_URI` | Yes | MongoDB connection string. |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWT tokens. |
| `RAZORPAY_KEY_ID` | Yes | Razorpay key ID used by the backend SDK. |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay secret used to create orders and verify signatures. |
| `NODE_ENV` | No | Set to `production` to hide error stacks in API responses. |

### Frontend

The current checkout page uses a Razorpay test key directly in `client/src/Pages/CheckOut.jsx`. For production, move the public key into a Vite environment variable:

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Then read it with:

```js
import.meta.env.VITE_RAZORPAY_KEY_ID
```

## Available Scripts

### Root

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the backend dev server through the root script. |
| `npm run dev:server` | Starts the backend dev server. |
| `npm run dev:client` | Starts the Vite frontend dev server. |
| `npm start` | Starts the backend in production mode. |

### Client

Run these from `client/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite development server. |
| `npm run build` | Build frontend for production. |
| `npm run preview` | Preview production build locally. |
| `npm run lint` | Run ESLint. |

### Server

Run these from `server/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start Express with nodemon. |
| `npm start` | Start Express with Node. |
| `node seed.js` | Seed categories and products. |

## API Reference

Base URL:

```text
http://localhost:5000/api
```

The deployed frontend currently uses:

```text
https://freshmart-0the.onrender.com/api
```

### Health

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | Public | Returns server status and database readiness. |

### Users

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/users/register` | Public | Create a user account. |
| `POST` | `/users/login` | Public | Login and receive a JWT token. |
| `GET` | `/users/profile` | Authenticated | Get the current user's profile. |
| `PUT` | `/users/profile` | Authenticated | Update name, gender, avatar, and address. |
| `GET` | `/users` | Authenticated admin | Get all users. |

Register body:

```json
{
  "name": "Raja",
  "email": "raja@example.com",
  "password": "password123",
  "gender": "male"
}
```

Login body:

```json
{
  "email": "raja@example.com",
  "password": "password123"
}
```

### Products

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/products` | Public | Get all products with populated categories. |
| `GET` | `/products/category/:categoryId` | Public | Get products by category ID. |
| `GET` | `/products/:id` | Public | Get one product by MongoDB ID. |
| `POST` | `/products` | Authenticated | Create a product. Used by the admin product page. |
| `DELETE` | `/products/:id` | Authenticated | Delete a product. Used by the admin product page. |

Create product body:

```json
{
  "name": "Fresh Apple",
  "price": 120,
  "unit": "per kg",
  "category": "category_mongodb_id",
  "stock": 50,
  "imageURL": "https://example.com/apple.jpg",
  "description": "Fresh red apples"
}
```

### Categories

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/categories` | Public | Get all categories. |
| `POST` | `/categories` | Public in API, admin-facing in UI | Create a category. |

Create category body:

```json
{
  "name": "Fruits",
  "image": "https://example.com/fruits.jpg",
  "description": "Fresh fruits"
}
```

### Orders

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/orders` | Authenticated | Create an order for the logged-in user. |
| `GET` | `/orders/myorders` | Authenticated | Get current user's order history. |
| `GET` | `/orders` | Authenticated | Get all orders. Used by admin dashboard and orders page. |
| `PUT` | `/orders/:id` | Authenticated | Update order status. Used by admin orders page. |

Create order body:

```json
{
  "items": [
    {
      "product": "product_mongodb_id",
      "quantity": 2,
      "price": 120,
      "name": "Fresh Apple",
      "image": "https://example.com/apple.jpg"
    }
  ],
  "deliveryAddress": {
    "street": "123 Main Street",
    "city": "Greater Noida",
    "state": "Uttar Pradesh",
    "pincode": "201310"
  }
}
```

Update order status body:

```json
{
  "status": "processing"
}
```

Allowed order statuses:

```text
pending, processing, shipped, delivered, cancelled
```

### Payments

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/payment/create-order` | Public route | Create a Razorpay order. |
| `POST` | `/payment/verify` | Public route | Verify Razorpay payment signature. |

Create payment order body:

```json
{
  "amount": 500
}
```

Verify payment body:

```json
{
  "razorpay_order_id": "order_id",
  "razorpay_payment_id": "payment_id",
  "razorpay_signature": "signature"
}
```

## Database Models

### User

Important fields:

- `name`
- `email`
- `password`
- `gender`
- `avatar`
- `address`
- `role`
- timestamps

Roles:

```text
customer, admin
```

### Category

Important fields:

- `name`
- `image`
- `description`
- timestamps

### Product

Important fields:

- `name`
- `price`
- `unit`
- `category`
- `stock`
- `imageURL`
- `description`
- `isFeatured`
- timestamps

### Order

Important fields:

- `user`
- `items`
- `totalAmount`
- `deliveryAddress`
- `status`
- `statusTimeline`
- `paymentStatus`
- timestamps

Each order item can store a reference to a product and also keeps snapshot fields such as `productName`, `productImage`, `quantity`, and `price`.

## Admin Access

New users are created with the default role:

```text
customer
```

To access admin pages, update a user role to `admin` in MongoDB. Example MongoDB shell command:

```js
db.users.updateOne(
  { email: "raja@example.com" },
  { $set: { role: "admin" } }
)
```

After updating the role, log out and log back in so the frontend stores the updated user role.

## Deployment Notes

### Frontend

The frontend is ready for Vercel-style deployment:

- Project directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrites are configured in `client/vercel.json`.

### Backend

The backend can be deployed to Render, Railway, or any Node hosting provider:

- Project directory: `server`
- Start command: `npm start`
- Set all backend environment variables in the hosting dashboard.
- Make sure MongoDB Atlas allows connections from the deployment environment.

### CORS

The server currently allows broad CORS access. For production, restrict CORS to the exact deployed frontend domain.

## Important Notes

- `client/src/services/api.js` currently has a hard-coded API base URL. Change it for local development or move it to an environment variable.
- The cart is stored in React state and resets on page refresh. Wishlist and auth data use `localStorage`.
- Some pages use static fallback products so the UI still has content even if the database has limited data.
- The backend continues running if MongoDB connection fails, but database routes return `503` through `requireDatabase`.
- The frontend route guard protects admin pages, while some admin-facing backend routes currently only require authentication. Add backend `admin` middleware to admin-facing product, category, and order routes before production.
- Do not commit `.env` files. They are already ignored by `.gitignore`.
- There is no automated test suite yet.

## Future Improvements

- Move API base URL and Razorpay public key to Vite environment variables.
- Persist cart items in `localStorage` or in the database.
- Add backend admin checks to every admin-facing API route.
- Add product update/edit support in the admin product page.
- Add order cancellation from the customer side.
- Add tests for auth, checkout, order creation, and admin actions.
- Add pagination and search to admin tables.
- Add proper image upload support instead of only image URLs or local mapped assets.

## Author

Built by Raja.
