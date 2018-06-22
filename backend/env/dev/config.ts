import * as admin from "firebase-admin";
const serviceAccountCredentials = require("./service_account.json");

const config = () => {
  return {
    credential: admin.credential.cert(serviceAccountCredentials),
    databaseURL: "https://minke-zhang.firebaseio.com"
  };
};

export { config };
