# Firebase Studio Next.js Starter

This is a Next.js starter project built in Firebase Studio. It's a fully functional web application with user and admin authentication, connected to a Firebase backend.

## Getting Started

To run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Deploying to a Platform like Hostinger

This application is ready to be deployed on any Node.js hosting platform like Hostinger, Vercel, or others.

### Environment Variables

For deployment, you need to set up environment variables to securely connect to your Firebase project.

1.  **Create a `.env.local` file** in the root of your project for local development.
2.  **Copy the contents** from `.env.local.example` into your new `.env.local` file.
3.  **Replace the placeholder values** with your actual Firebase project configuration. You can find these values in your Firebase project settings under Project settings > General > Your apps > SDK setup and configuration.

When you deploy to your hosting provider (like Hostinger), you will need to set these same key-value pairs in the environment variables section of your hosting platform's dashboard.

**Example Environment Variables:**

```
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="..."
```

### Build and Run Commands

-   `npm install` to install dependencies.
-   `npm run build` to create a production-ready build.
-   `npm run start` to start the production server.

Follow your hosting provider's documentation for setting up a Node.js application.
