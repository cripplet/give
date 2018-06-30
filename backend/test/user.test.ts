import "jest";

import * as admin from "firebase-admin";
import * as request from "request-promise-native";

import * as config from "../env/config";
import * as user from "../src/models/user";

admin.initializeApp(config.config("dev").adminAppConfig);

const userDetails = {
  username: "testUser",
  email: "some.test@gmail.com",
  phone: "+15555555555"
};

interface VerifyCustomTokenResponse {
  kind: string;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}

describe("Test Admin SDK User management", (): void => {
  beforeEach((done: jest.DoneCallback): Promise<void> => {
    return admin
      .auth()
      .getUserByEmail(userDetails.email)
      .then(
        (userRecord: admin.auth.UserRecord): Promise<void> => {
          return admin.auth().deleteUser(userRecord.uid);
        }
      )
      .then(() => {
        done();
      })
      .catch(() => {
        done();
      });
  });
  test("getJWTCredentials", (done: jest.DoneCallback): Promise<void> => {
    return admin
      .auth()
      .createUser({
        disabled: false, // allow sign-in
        displayName: userDetails.username,
        email: userDetails.email,
        emailVerified: false,
        phoneNumber: userDetails.phone
      })
      .then(
        (userRecord: admin.auth.UserRecord): Promise<string> => {
          return admin.auth().createCustomToken(userRecord.uid);
        }
      )
      .then(
        (
          customToken: string
        ): request.RequestPromise<VerifyCustomTokenResponse> => {
          return request({
            // sign in as the user to get ID token
            method: "POST",
            uri:
              "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken",
            qs: {
              key: config.config("dev").clientAppConfig.apiKey
            },
            headers: {
              "Content-Type": "application/json"
            },
            json: true,
            body: {
              token: customToken,
              returnSecureToken: true
            }
          });
        }
      )
      .then(
        (response: VerifyCustomTokenResponse): Promise<string> => {
          expect(response.idToken).not.toBe("");
          return user.getJWTCredentials(response.idToken);
        }
      )
      .then(
        (customToken: string): void => {
          expect(customToken).not.toBe("");
          done();
        }
      );
  });
});
