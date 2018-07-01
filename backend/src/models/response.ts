import * as admin from "firebase-admin";

function getReturnType<R>(fn: (...args: any[]) => R): R {
  return {} as R;
}

const createResponse = (
  idToken: string,
  surveyID: string,
  response: string
): Promise<void> => {
  const docRef = admin.firestore().collection("surveys").doc(surveyID);
  return admin.auth().verifyIdToken(idToken, true).then(
    (decodedIdToken: admin.auth.DecodedIdToken): Promise<admin.firestore.DocumentSnapshot> => {
      return docRef.get();
  }).then((docSnapshot: admin.firestore.DocumentSnapshot) => {
    if (docSnapshot.exists) {
      return docRef.set({
        response: response
      });
    } else {
      return Promise.reject(new Error("Survey does not exist"));
    }
  });
};

export { createResponse };
