import * as admin from "firebase-admin";

const serviceAccountCredentials = require("./service_account.json");
const oauthCredentials = require("./oauth.json");

const config = () => {
  return {
    credential: admin.credential.cert(serviceAccountCredentials),
    databaseURL: "https://minke-zhang.firebaseio.com"
  };
};

const oauth = () => {
  return {
    id: oauthCredentials.id,
    secret: oauthCredentials.secret
  }
}

export { config };
export { oauth };
