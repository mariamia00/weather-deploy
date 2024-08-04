"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucket = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
// Retrieve and decode the Base64 encoded service account key
const base64EncodedServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
if (!base64EncodedServiceAccount) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_BASE64 is not defined in environment variables");
}
const serviceAccountJson = Buffer.from(base64EncodedServiceAccount, "base64").toString("utf8");
const serviceAccount = JSON.parse(serviceAccountJson);
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
    storageBucket: "vreme-nebuna.appspot.com", // Replace with your Firebase Storage bucket name
});
const bucket = firebase_admin_1.default.storage().bucket();
exports.bucket = bucket;
