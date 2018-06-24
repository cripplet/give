import * as admin from "firebase-admin";
import * as rest from "typed-rest-client/RestClient";

const loginUser = async () => {
  let client: rest.RestClient = new rest.RestClient(
    'oauth-getter',
    'https://accounts.google.com',
  );
  
};

const getJWTCredentials = async (uid: string): Promise<string> => {
  // assuming uid exists
  return admin.auth().createCustomToken(uid);
};

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
    let user_req = getUser(request);
    return user_req.then((userRecord) => {
      return admin.auth().deleteUser(userRecord.uid);
    });
  }
  return admin.auth().deleteUser(request.uid);
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

export { createUser };
export { deleteUser };
export { getUser };
export { getJWTCredentials };
