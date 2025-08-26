# Poppes Natural - E-commerce Website

A complete business-ready e-commerce website for natural products built with React, TypeScript, and Firebase.

## Features

### 🌿 Core Features
- **Complete E-commerce Functionality**: Shopping cart, product management, order processing
- **Firebase Backend**: Authentication, Firestore database, Storage for images
- **Role-based Access Control**: Admin and customer roles with different permissions
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: Live inventory tracking and stock management
- **Secure Authentication**: Email/password login with role-based access

### 🎨 Design & UX
- **Nature-inspired Design**: Green, golden yellow, and earthy brown color palette
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Professional Layout**: Product cards, shopping cart, admin dashboard
- **Accessibility**: Proper contrast ratios and keyboard navigation

### 🛍️ Customer Features
- Browse products with search and filtering
- Add items to cart with quantity management
- Secure checkout process (placeholder)
- Order tracking (placeholder)
- User authentication and profiles

### 👨‍💼 Admin Features
- Secure admin panel with role-based access
- Product management (add, edit, delete, stock control)
- Order management and status updates
- Image upload for products
- Dashboard with overview statistics

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Routing**: React Router v6
- **State Management**: React Context API
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites
- Node.js 16+ installed
- Firebase project set up

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a new Firebase project
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Enable Storage
   - Update `src/lib/firebase.ts` with your configuration

4. Start the development server:
   ```bash
   npm run dev
   ```

## Firebase Setup

### 1. Authentication
- Enable Email/Password authentication
- Create admin users with custom claims

### 2. Firestore Database
Create these collections:
- `products`: Store product information
- `orders`: Store customer orders
- `users`: Store user profiles and roles

### 3. Security Rules
Configure Firestore security rules to protect data based on user roles.

### 4. Storage
Set up Firebase Storage for product images with proper security rules.

## Environment Variables

Create a `.env` file with your Firebase configuration:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Header, Footer
│   ├── products/       # Product-related components
│   └── ui/            # Basic UI components
├── contexts/           # React Context providers
├── data/              # Mock data and constants
├── lib/               # Third-party library configurations
├── pages/             # Page components
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```


## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact: info@poppesnatural.com
