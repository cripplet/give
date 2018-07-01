import * as admin from "firebase-admin";
import { from, Observable } from "rxjs";
import { flatMap, map } from "rxjs/operators";

/* TODO(cripplet): Check error handling. */
const getJWTCredentials = (idToken: string): Observable<string> => {
  return from(admin.auth().verifyIdToken(idToken, true)).pipe(
    map(
      (decodedIdToken: admin.auth.DecodedIdToken): string => decodedIdToken.uid
    ),
    flatMap(
      (uid: string): Observable<string> =>
        from(admin.auth().createCustomToken(uid))
    )
  );
};

export { getJWTCredentials };
