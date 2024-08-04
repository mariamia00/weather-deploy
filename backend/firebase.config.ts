import admin from "firebase-admin";

// Retrieve and decode the Base64 encoded service account key
const base64EncodedServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
if (!base64EncodedServiceAccount) {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT_BASE64 is not defined in environment variables"
  );
}

const serviceAccountJson = Buffer.from(
  base64EncodedServiceAccount,
  "base64"
).toString("utf8");
const serviceAccount = JSON.parse(serviceAccountJson);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: "vreme-nebuna.appspot.com", // Replace with your Firebase Storage bucket name
});

const bucket = admin.storage().bucket();

export { bucket };
