import * as admin from "firebase-admin";

const getJWTCredentials = (idToken: string): Promise<string> => {
  // assuming uid exists
  // pass this to all calls that need it -- we will auth using this
  // not with the Google credentials for API-based stuff.
  // get via client getIdToken()
  return admin
    .auth()
    .verifyIdToken(idToken, true)
    .then(
      (decodedIdToken: admin.auth.DecodedIdToken): Promise<string> => {
        return admin.auth().createCustomToken(decodedIdToken.uid);
      }
    );
};

export { getJWTCredentials };
