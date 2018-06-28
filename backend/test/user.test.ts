import "jest";

import * as admin from "firebase-admin";

import * as config from "../env/dev/config";
import * as user from "../src/models/user";

admin.initializeApp(config.config());

const userDetails = {
  username: "testUser",
  email: "some.test@gmail.com",
  phone: "+15555555555"
};

describe("Test Admin SDK User management", (): void => {
  beforeEach(async (): Promise<void> => {
    await user.deleteUser({ email: userDetails.email });
  });
  test("testCreateUser", async (done): Promise<void> => {
    let create_user_req = user.createUser(
      userDetails.username,
      userDetails.email,
      userDetails.phone
    );
    let expected: admin.auth.UserRecord;
    create_user_req
      .then(
        (userRecord): Promise<admin.auth.UserRecord> => {
          expected = Object.assign({}, userRecord);
          let get_user_req = user.getUser({ uid: expected.uid });
          return get_user_req;
        }
      )
      .then(
        (userRecord): void => {
          expect(expected).toEqual(userRecord);
          done();
        }
      );
    await create_user_req;
  });
  test("getJWTCredentials", async (done): Promise<void> => {
    let create_user_req = user.createUser(
      userDetails.username,
      userDetails.email,
      userDetails.phone
    );
    let expected: admin.auth.UserRecord;
    create_user_req.then((userRecord): Promise<string> => {
      expected = Object.assign({}, userRecord);
      return user.getJWTCredentials(userRecord.uid);
    }).then((jwtCredentials: string): void => {
      done();
    });
    await create_user_req;
  });
});
