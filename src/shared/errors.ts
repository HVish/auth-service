import { StatusCodes } from 'http-status-codes';
import { createServerErrorClass } from '../utils/error';

export const InvalidCredentialsError = createServerErrorClass({
  name: 'InvalidCredentialsError',
  defaultCode: StatusCodes.UNAUTHORIZED,
  defaultmessage: 'Invalid credentials provided.',
});

export const AuthTokenNotProvidedError = createServerErrorClass({
  name: 'AuthTokenNotProvidedError',
  defaultCode: StatusCodes.FORBIDDEN,
  defaultmessage: 'Auth token is missing.',
});

export const UnSupportedAuthSchemeError = createServerErrorClass({
  name: 'UnSupportedAuthSchemeError',
  defaultCode: StatusCodes.FORBIDDEN,
  defaultmessage: 'This authorization strategy is not supported.',
});

export const AuthTokenExpiredError = createServerErrorClass({
  name: 'AuthTokenExpiredError',
  defaultCode: StatusCodes.UNAUTHORIZED,
  defaultmessage: 'Auth token expired.',
});

export const MalformedAuthTokenError = createServerErrorClass({
  name: 'MalformedAuthTokenError',
  defaultCode: StatusCodes.FORBIDDEN,
  defaultmessage: 'Malformed auth token is provided.',
});

export const UsernameExistsError = createServerErrorClass({
  name: 'UsernameExistsError',
  defaultCode: StatusCodes.PRECONDITION_FAILED,
  defaultmessage: 'This username already exists.',
});
