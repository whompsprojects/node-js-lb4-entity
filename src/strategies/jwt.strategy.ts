import {AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors, RedirectRoute, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {ParamsDictionary} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import {MyUserService} from '../services/user.service';

export class JWTStrategy implements AuthenticationStrategy {
  constructor(@inject('service.user') public userService: MyUserService) {}
  name: string = 'jwt';
  async authenticate(
    request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
  ): Promise<UserProfile | RedirectRoute | undefined> {
    const token = this.extractCredential(request);
    const userProfile = await this.userService.verifyToken(token);
    return Promise.resolve(userProfile);
  }

  extractCredential(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized('Authorization header is missing');
    }
    const authHeader = request.headers.authorization;
    const parts = authHeader.split(' ');
    if (authHeader.startsWith('Bearer') || parts.length !== 2) {
      throw new HttpErrors.Unauthorized(`Invalid token`);
    }
    return parts[1];
  }
}
