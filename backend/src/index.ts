import * as admin from "firebase-admin";
import * as config from "../env/prod/config";

admin.initializeApp(config.config());

// import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
