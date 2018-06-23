import * as admin from "firebase-admin";

const createUser = async (
  username: string,
  email: string,
  phone: string
): Promise<admin.auth.UserRecord> => {
  let create_user_req = admin.auth().createUser({
    disabled: true,
    displayName: username,
    email: email,
    emailVerified: false,
    phoneNumber: phone
  });
  return create_user_req;
};

const deleteUser = async (request: GetUserRequest): Promise<void> => {
  if (!request.uid) {
    let user = await getUser(request);
    request.uid = user.uid;
  }
  let delete_user_req = admin.auth().deleteUser(request.uid);
  return delete_user_req;
};

interface GetUserRequest {
  uid?: string;
  email?: string;
  phone?: string;
}

const getUser = async (
  request: GetUserRequest
): Promise<admin.auth.UserRecord> => {
  if (request.uid) {
    return admin.auth().getUser(request.uid);
  } else if (request.email) {
    return admin.auth().getUserByEmail(request.email);
  } else {
    return admin.auth().getUserByPhoneNumber(request.phone);
  }
};

// const update = async (user: User):

// Looks like client lib has user.delete?

const listAllUsers = (nextPageToken): Promise<any> => {
  return admin
    .auth()
    .listUsers(1000, nextPageToken)
    .then((listUsersResult) => {
      console.log("HIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
      return listUsersResult;
    })
    .catch((error) => {
      console.log("ERROR", error);
      return null;
    });
};

const f = (x: string): number => {
  return 1;
};

export { createUser };
export { deleteUser };
export { getUser };
export { listAllUsers };
export { f };
