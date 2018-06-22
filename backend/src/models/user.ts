import * as admin from "firebase-admin";

type User = {
  uid: string;
  auid: string;
};

/*
const create = async (
  email: string,
  phone: string,
  username: string,
  password: string): Promise<admin.auth.UserRecord> => {
}
*/
const listAllUsers = (nextPageToken): Promise<any> => {
  return admin
    .auth()
    .listUsers(1000, nextPageToken)
    .then(listUsersResult => {
      console.log("HIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
      return listUsersResult;
    })
    .catch(error => {
      console.log("ERROR", error);
      return null;
    });
};

const f = (x: string): number => {
  return 1;
};

export { listAllUsers };
export { f };
