import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {
  OPERATION_SECURITY_SPEC,
  SECURITY_SCHEME_SPEC,
} from './core/swagger.spec';
import {AuthSequence} from './sequence';
import {MyUserService} from './services/user.service';
import {Hasher} from './services/util.service';
import {JWTStrategy} from './strategies/jwt.strategy';

export {ApplicationConfig};

export class CmsApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.api({
      openapi: '3.0.0',
      info: {title: 'CMS-Translation', version: '1.0'},
      paths: {},
      components: {securitySchemes: SECURITY_SCHEME_SPEC},
      servers: [
        {url: 'http://127.0.0.1:3000', name: 'local'},
        {url: 'https://127.0.0.1:3001', name: 'uat'},
      ],
      security: OPERATION_SECURITY_SPEC,
    });
    this.setBinding();

    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTStrategy);
    // Set up the custom sequence
    this.sequence(AuthSequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setBinding(): void {
    this.bind('service.hasher').toClass(Hasher);
    this.bind('service.user').toClass(MyUserService);
    this.bind('hash.round').to(10);
    this.bind('jwt.secretKey').to('2345tgth');
    this.bind('jwt.expireTime').to('1h');
  }
}
