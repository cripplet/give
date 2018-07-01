import "jest";

import * as admin from "firebase-admin";
import * as requestBase from "request";
import * as request from "request-promise-native";

import { of, from, fromEvent, Observable } from "rxjs";
import { flatMap, map, onErrorResumeNext } from "rxjs/operators";

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
  beforeEach((done: jest.DoneCallback): void => {
    const observable: Observable<void> = of(userDetails.email).pipe(
      flatMap(
        (email: string): Observable<admin.auth.UserRecord> =>
          from(admin.auth().getUserByEmail(email))
      ),
      map((userRecord: admin.auth.UserRecord): string => userRecord.uid),
      flatMap(
        (uid: string): Observable<void> => from(admin.auth().deleteUser(uid))
      ),
      onErrorResumeNext(of())
    );
    observable.subscribe({
      complete: done
    });
  });
  test("getCorrectJWTCredentials", (done: jest.DoneCallback): void => {
    const observable: Observable<string> = from(
      admin.auth().createUser({
        disabled: false, // allow sign-in
        displayName: userDetails.username,
        email: userDetails.email,
        emailVerified: false,
        phoneNumber: userDetails.phone
      })
    ).pipe(
      map((userRecord: admin.auth.UserRecord): string => userRecord.uid),
      flatMap(
        (uid: string): Observable<string> =>
          from(admin.auth().createCustomToken(uid))
      ),
      flatMap(
        (customToken: string): Observable<VerifyCustomTokenResponse> =>
          from(
            request({
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
            })
          )
      ),
      map(
        (response: VerifyCustomTokenResponse): string => {
          expect(response.idToken).toBeTruthy();
          return response.idToken;
        }
      ),
      flatMap(
        (idToken: string): Observable<string> => user.getJWTCredentials(idToken)
      )
    );
    observable.subscribe(
      (customToken: string): void => {
        expect(customToken).toBeTruthy();
        done();
      }
    );
  });
});
