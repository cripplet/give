import * as admin from "firebase-admin";

const getJWTCredentials = async (idToken: string): Promise<string> => {
  // assuming uid exists
  // pass this to all calls that need it -- we will auth using this
  // not with the Google credentials
  // get via client getIdToken().
  return admin.auth().verifyIdToken(idToken, true).then(
    (decodedIdToken: admin.auth.DecodedIdToken): Promise<string> => {
      return admin.auth().createCustomToken(decodedIdToken.uid);
    })
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
