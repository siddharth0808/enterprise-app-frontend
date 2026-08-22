export interface CognitoSignUpParams {
  fullName:string
  email: string;
  password: string;
}

export interface CognitoAuthUser {
  /** Cognito `sub` claim - stable unique id for the signed-in user. */
  id: string;
  email: string;
  fullName:string;
}
