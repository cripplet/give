import * as admin from "firebase-admin";

/**
 * Config is generated from https://firebase.google.com/docs/admin/setup.
 *
 * Example:
 *
 * {
 *   "type": "service_account",
 *   "project_id": "some-project",
 *   "private_key_id": "0xdeadbeef",
 *   "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
 *   "client_email": "some-service-account@some-domain.com",
 *   "client_id": "8005556752",
 *   "auth_uri": "http://endpoint.com/...",
 *   "token_uri": "http://endpoint.org/...",
 *   "auth_provider_x509_cert_url": "http://endpoint.net/...",
 *   "client_x509_cert_url": "..."
 * }
 */
interface AdminAppConfig {
  credential: admin.credential.Credential;
  databaseURL: string;
}

/**
 * Config is generated from https://firebase.google.com/docs/web/setup.
 *
 * Example:
 * {
 *   "apiKey": "ToTaLiYrAnDoMsTrInG-hErE",
 *   "authDomain": "some-project.firebaseapp.com",
 *   "databaseURL": "https://some-project.firebaseio.com",
 *   "projectId": "some-project",
 *   "storageBucket": "some-project.appspot.com",
 *   "messagingSenderId": "8675309"
 * }
 */
interface ClientAppConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
}

interface Config {
  adminAppConfig: AdminAppConfig;
  clientAppConfig: ClientAppConfig;
}

const config = (env: string) => {
  let serviceAccountCredential = require(`./${env}/service_account.json`);
  return {
    adminAppConfig: {
      credential: admin.credential.cert(serviceAccountCredential),
      databaseURL: `https://${
        serviceAccountCredential.project_id
      }.firebaseio.com`
    },
    clientAppConfig: require(`./${env}/client_config.json`)
  };
};

export { config };
