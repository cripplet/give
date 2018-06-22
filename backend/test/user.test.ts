import "jest";

import * as admin from "firebase-admin";
import * as config from "../env/dev/config";

import * as user from "../src/models/user";

admin.initializeApp(config.config());

test("listAllUsers", () => {
  let l = user.listAllUsers(undefined);
  return l
    .then(listUsersResult => {
      console.log(listUsersResult);
      listUsersResult.users.forEach(function(userRecord) {
        console.log("user", userRecord.toJSON());
      });
    })
    .catch(error => {
      console.log("some err", error);
    });
});
