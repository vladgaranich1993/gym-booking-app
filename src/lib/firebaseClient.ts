import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const clientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
};

if (!getApps().length) initializeApp(clientConfig);
export const auth = getAuth();
