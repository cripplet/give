import * as admin from "firebase-admin";

import { from, Observable } from "rxjs";
import { flatMap, map } from "rxjs/operators";

const createResponse = (
  idToken: string,
  surveyID: string,
  response: string
): Observable<void> => {
  const docRef = admin
    .firestore()
    .collection("surveys")
    .doc(surveyID);
  const observable: Observable<void> = of(surveyID).pipe(
    map((surveyID: string): admin.auth.DocumentReference => admin.firestore().collection("surveys").doc(surveyID)),
  );
  return admin
    .auth()
    .verifyIdToken(idToken, true)
    .then(
      (
        decodedIdToken: admin.auth.DecodedIdToken
      ): Promise<admin.firestore.DocumentSnapshot> => {
        return docRef.get();
      }
    )
    .then((docSnapshot: admin.firestore.DocumentSnapshot) => {
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
