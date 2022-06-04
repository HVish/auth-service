import joi from 'joi';
import {
  CreateClientRequest,
  CreateTokenRequest,
  LaunchRequest,
} from '../../interfaces/ClientAPI';
import { GrantType } from '../../models/ClientModel';
import {
  createTokenValidator,
  launchValidator,
  createClientValidator,
} from '../ClientValidator';

describe('createClientValidator', () => {
  const schema = createClientValidator(joi);

  it('should return errors', () => {
    const data: CreateClientRequest = {
      logo: '',
      name: '',
      redirectURIs: [''],
      secret: '',
    };
    const result = schema.body.validate(data, { abortEarly: false });
    expect(result.error).toBeDefined();
    const invalidKeys = (result.error?.details || []).map(e => e.path[0]);
    for (const key in data) {
      expect(invalidKeys).toContain(key);
    }
  });
});

describe('launchValidator', () => {
  const schema = launchValidator(joi);

  it('should return errors', () => {
    const data: LaunchRequest = { clientId: '', redirectURI: '' };
    const result = schema.body.validate(data, { abortEarly: false });
    expect(result.error).toBeDefined();
    const invalidKeys = (result.error?.details || []).map(e => e.path[0]);
    for (const key in data) {
      expect(invalidKeys).toContain(key);
    }
  });

  it('should not return errors', () => {
    const data: LaunchRequest = {
      clientId: 'test-client-id',
      redirectURI: 'https://localhost/auth/success',
    };
    const result = schema.body.validate(data);
    expect(result.error).toBeUndefined();
  });

  it('should accept only a valid http or https url scheme', () => {
    const commonValidPayload: Omit<LaunchRequest, 'redirectURI'> = {
      clientId: 'test-client-id',
    };

    const invalidURIInputs: LaunchRequest[] = [
      {
        ...commonValidPayload,
        redirectURI: 'file://localhost/auth/success',
      },
      {
        ...commonValidPayload,
        redirectURI: 'ftp://localhost/auth/success',
      },
      {
        ...commonValidPayload,
        redirectURI: 'random invalid uri format',
      },
    ];

    const validURIInputs = [
      {
        ...commonValidPayload,
        redirectURI: 'http://localhost/auth/success',
      },
      {
        ...commonValidPayload,
        redirectURI: 'https://localhost/auth/success',
      },
    ];

    invalidURIInputs.forEach(input => {
      const result = schema.body.validate(input);
      expect(result.error?.details[0]).toBeDefined();
      expect(result.error?.details[0].path).toContain('redirectURI');
    });

    validURIInputs.forEach(input => {
      const result = schema.body.validate(input);
      expect(result.error).toBeUndefined();
    });
  });
});

describe('createTokenValidator', () => {
  const schema = createTokenValidator(joi);

  it('should return errors', () => {
    const data: CreateTokenRequest = {
      clientId: '',
      grant: '',
      grantType: '' as GrantType.AUTH_CODE,
      secret: '',
    };
    const result = schema.body.validate(data, { abortEarly: false });
    expect(result.error).toBeDefined();
    const invalidKeys = (result.error?.details || []).map(e => e.path[0]);
    for (const key in data) {
      expect(invalidKeys).toContain(key);
    }
  });

  it('should not return errors', () => {
    const data: CreateTokenRequest = {
      clientId: 'test-client-id',
      grant: 'saf134Afdsf!33',
      grantType: GrantType.AUTH_CODE,
      secret: '@1234$$3123##',
    };
    const result = schema.body.validate(data);
    expect(result.error).toBeUndefined();
  });

  it('should not allow any grant types other than auth_code', () => {
    const data: CreateTokenRequest = {
      clientId: 'test-client-id',
      grant: 'saf134Afdsf!33',
      grantType: GrantType.AUTH_CODE,
      secret: '@1234$$3123##',
    };
    const result = schema.body.validate({
      ...data,
      grantType: GrantType.ACCESS_TOKEN,
    });
    expect(result.error?.details[0]).toBeDefined();
    expect(result.error?.details[0].path).toContain('grantType');
  });
});
