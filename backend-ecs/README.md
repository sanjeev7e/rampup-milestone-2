# Backend ECS - Products CRUD API

A simple Express.js CRUD API with DynamoDB connection for product management, designed to run on ECS (Elastic Container Service).

## Features

- **Create** products with image and brochure uploads to S3
- **Read** products (list all or get by ID)
- **Update** products with partial updates support
- **Delete** products
- **Search & Filter** products by name and category

## Prerequisites

- [Bun](https://bun.sh) runtime
- AWS account with DynamoDB table and S3 bucket configured
- AWS credentials configured (via environment variables or IAM role)

## Installation

```bash
bun install
```

## Configuration

Create a `.env` file based on `.env.example`:

```env
# Server Configuration
PORT=3000

# AWS Configuration
REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key

# DynamoDB Configuration
PRODUCTS_TABLE=Products

# S3 Configuration
PRODUCTS_BUCKET=your-products-bucket-name
```

## Running the Server

### Development (with hot reload)

```bash
bun run dev
```

### Production

```bash
bun run start
```

## API Endpoints

| Method | Endpoint        | Description                                                          |
| ------ | --------------- | -------------------------------------------------------------------- |
| GET    | `/`             | Health check / Welcome message                                       |
| GET    | `/health`       | Health check for load balancer                                       |
| GET    | `/products`     | Get all products (supports `?search=` and `?category=` query params) |
| GET    | `/products/:id` | Get a specific product by ID                                         |
| POST   | `/products`     | Create a new product                                                 |
| PUT    | `/products/:id` | Update a product                                                     |
| DELETE | `/products/:id` | Delete a product                                                     |

## Example Requests

### Create Product

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "Test Product",
    "productCategory": "Electronics",
    "productDescription": "A test product",
    "form": "Solid",
    "safety": "Non-Flammable",
    "uom": "Per Unit",
    "ratePerUnit": 100,
    "marketSellingPrice": 150,
    "saleProfitMargin": 33,
    "ecoFriendly": true,
    "handleWithCare": false
  }'
```

### Get All Products

```bash
curl http://localhost:3000/products
curl http://localhost:3000/products?search=test
curl http://localhost:3000/products?category=Electronics
```

### Get Product by ID

```bash
curl http://localhost:3000/products/{product-id}
```

### Update Product

```bash
curl -X PUT http://localhost:3000/products/{product-id} \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "Updated Product Name",
    "marketSellingPrice": 200
  }'
```

### Delete Product

```bash
curl -X DELETE http://localhost:3000/products/{product-id}
```

## Project Structure

```
backend-ecs/
├── index.ts                 # Express server entry point
├── src/
│   ├── entities/
│   │   └── Product.ts       # Product type definitions
│   ├── routes/
│   │   └── products.ts      # Product CRUD routes
│   └── utils/
│       ├── dynamodb.ts      # DynamoDB client
│       ├── response.ts      # Response helpers
│       └── s3.ts            # S3 upload utility
├── package.json
├── Dockerfile
└── serverless.yml           # ECS deployment config
```

## Docker

Build and run with Docker:

```bash
docker build -t backend-ecs .
docker run -p 3000:3000 --env-file .env backend-ecs
```

## Deployment

Deploy to AWS ECS using Serverless Framework:

```bash
serverless deploy
```
