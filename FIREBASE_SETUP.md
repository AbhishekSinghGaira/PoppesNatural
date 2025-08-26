# Firebase Setup Instructions

## 🔥 Firebase Storage CORS Error Fix

The CORS error you're experiencing is due to Firebase Storage security rules. Here's how to fix it:

### 1. Firebase Storage Security Rules

Go to your Firebase Console → Storage → Rules and update them:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload product images
    match /products/{allPaths=**} {
      allow read: if true; // Anyone can read product images
      allow write: if request.auth != null && 
                      request.auth.token.admin == true; // Only admins can upload
    }
    
    // Default rule - deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### 2. Firestore Security Rules

Go to Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true; // Anyone can read products
      allow write: if request.auth != null && request.auth.token.admin == true; // Only admins can modify
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
                           (request.auth.uid == resource.data.userId || 
                            request.auth.token.admin == true);
      allow create: if request.auth != null;
    }
  }
}
```

### 3. Set Up Admin User

You need to create an admin user with custom claims. Run this in your Firebase Functions or use the Firebase Admin SDK:

```javascript
// This should be run server-side (Firebase Functions or Admin SDK)
const admin = require('firebase-admin');

// Set admin custom claim
admin.auth().setCustomUserClaims('USER_UID_HERE', { admin: true })
  .then(() => {
    console.log('Admin claim set successfully');
  });
```

### 4. Authentication Setup

In Firebase Console → Authentication:

1. **Enable Email/Password** sign-in method
2. **Create test users**:
   - Admin: admin@poppesnatural.com
   - Customer: customer@example.com

### 5. Alternative: Use Pexels Images (Temporary Fix)

For now, you can use Pexels stock images instead of uploading:

```javascript
// Example product images from Pexels
const sampleImages = [
  'https://images.pexels.com/photos/6544373/pexels-photo-6544373.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/161556/spice-turmeric-cooking-ingredient-161556.jpeg?auto=compress&cs=tinysrgb&w=600'
];
```

### 6. CORS Configuration (If needed)

If you still have CORS issues, you can configure CORS for Firebase Storage using gsutil:

```bash
# Create cors.json file
{
  "origin": ["https://your-domain.com", "http://localhost:3000"],
  "method": ["GET", "POST", "PUT", "DELETE"],
  "maxAgeSeconds": 3600
}

# Apply CORS configuration
gsutil cors set cors.json gs://poppes-natural.firebasestorage.app
```

### 7. Testing Steps

1. **Deploy the security rules** in Firebase Console
2. **Create an admin user** with custom claims
3. **Test login** with admin credentials
4. **Try uploading** a product image
5. **Check browser console** for any remaining errors

### 8. Troubleshooting

If you still get errors:

1. **Check Firebase Console logs** for detailed error messages
2. **Verify authentication** - make sure user is logged in
3. **Check custom claims** - admin users need `admin: true` claim
4. **Test with smaller images** - large files might timeout
5. **Use browser dev tools** to inspect network requests

## Quick Fix for Demo

For immediate testing, you can temporarily use this permissive Storage rule (NOT for production):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Remember to tighten security rules before going to production!