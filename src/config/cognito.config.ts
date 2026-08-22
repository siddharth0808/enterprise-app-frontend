import { env } from './env';

export const cognitoConfig = {
  UserPoolId: env.cognitoUserPoolId,
  ClientId: env.cognitoUserPoolClientId,
};
