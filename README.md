# Mamak Bien-Être E-commerce Platform

Mamak Bien-Être is a full-stack e-commerce website with a customer storefront, a separate administration interface, and an Express API. The application supports product browsing, cart and order workflows, customer accounts, order management, and payment initiation through Konnect.

Live website: https://mamakbienetre.com

## Applications

| Directory | Purpose | Main technologies |
| --- | --- | --- |
| `frontend/` | Customer storefront | React 19, Vite, Tailwind CSS, React Router |
| `admin/` | Store administration | React 19, Vite, Tailwind CSS, Quill |
| `backend/` | API, sessions, database access, payment integration | Node.js, Express 5, MongoDB, Mongoose |

The backend also serves the built storefront at the root path and the built admin application under `/admin`.

## Storefront features

The customer application includes:

- Product collections and product detail pages
- Shopping cart and checkout flow
- Customer registration and login
- Customer profile and order history
- Order confirmation pages
- Newsletter subscription and unsubscribe flows
- Responsive layouts and translated interface content

## Administration features

The administration interface includes:

- Dashboard and store activity overview
- Product creation and product listing management
- Pending, completed, and cancelled order views
- User management
- Product content editing

The backend exposes route groups for users, products, cart, orders, newsletter, dashboard, analytics, and payments.

## Payment and media integrations

- **Konnect:** Payment initiation and webhook handling for TND transactions.
- **Cloudinary:** Product and other uploaded media.
- **MongoDB:** Product, customer, order, and session data.
- **Mongo-backed sessions:** Session persistence through `express-session` and `connect-mongo`.

Payment provider credentials and database credentials must stay in the backend environment. Do not place private keys in either frontend application.

## Technology

**Storefront**
- React 19
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Axios
- i18next and react-i18next

**Admin**
- React 19
- Vite
- React Router
- Tailwind CSS
- Quill editor
- Axios

**Backend**
- Node.js with ES modules
- Express 5
- MongoDB and Mongoose
- express-session and connect-mongo
- bcrypt and JSON Web Tokens
- Cloudinary
- Nodemailer
- Axios for the Konnect API

## Local development

Each application has its own dependencies. Open a terminal for each one.

### Backend

```bash
cd backend
npm install
npm run server
```

The backend listens on port `4000` by default. To run it without nodemon:

```bash
npm start
```

Create `backend/.env` with the configuration used by the server:

```env
PORT=4000
NODE_ENV=development
MONGODB_URL=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_api_secret
KONNECT_WALLET_ID=your_konnect_wallet_id
KONNECT_BASE_URL=your_konnect_api_base_url
KONNECT_API_KEY=your_konnect_api_key
BACKEND_URL=http://localhost:4000
```

Use the actual values and URLs for your environment. Keep this file out of version control.

### Customer storefront

```bash
cd frontend
npm install
npm run dev
```

Build and lint the storefront with:

```bash
npm run build
npm run lint
```

### Admin application

```bash
cd admin
npm install
npm run dev
```

Build and lint the admin application with:

```bash
npm run build
npm run lint
```

Vite prints the local development URL for each frontend when it starts.

## Deployment notes

The backend is configured to serve the production build from `frontend/dist` and the admin build from `admin/dist`. Build both applications before deploying the backend in this mode.

Configure the production database, session secret, Cloudinary account, Konnect credentials, and allowed frontend URLs in the server environment. Test payment and webhook behaviour in the provider's test environment before accepting live transactions.
