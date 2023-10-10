import {HttpErrors} from '@loopback/rest';
import * as isEmail from 'isemail';
import {Credential} from '../repositories/user.repository';

export function validateCredential(credential: Credential) {
  if (!isEmail.validate(credential.email)) {
    throw new HttpErrors.UnprocessableEntity('Invalid email');
  }

  if (credential.password.length < 3) {
    throw new HttpErrors.UnprocessableEntity('Invalid password');
  }
}
