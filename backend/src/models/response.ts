import * as admin from "firebase-admin";

const createResponse = async (
  idToken: string,
  surveyID: string,
  response: string,
): Promise<bool> => {
  // update read-only user response history
  // validate surveyID, response
};

export { createResponse };
