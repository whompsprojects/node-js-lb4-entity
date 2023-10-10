import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Translation, User} from '../models';
import {TranslationRepository} from '../repositories';

@authenticate('jwt')
export class TranslationUserController {
  constructor(
    @repository(TranslationRepository)
    protected translationRepository: TranslationRepository,
  ) {}

  @get('/translations/{id}/users', {
    responses: {
      '200': {
        description: 'Array of Translation has many User',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<User>,
  ): Promise<User[]> {
    return this.translationRepository.users(id).find(filter);
  }

  @post('/translations/{id}/users', {
    responses: {
      '200': {
        description: 'Translation model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Translation.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUserInTranslation',
            exclude: ['user_id'],
            optional: ['created_by'],
          }),
        },
      },
    })
    user: Omit<User, 'user_id'>,
  ): Promise<User> {
    return this.translationRepository.users(id).create(user);
  }

  @patch('/translations/{id}/users', {
    responses: {
      '200': {
        description: 'Translation.User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: Partial<User>,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.translationRepository.users(id).patch(user, where);
  }

  @del('/translations/{id}/users', {
    responses: {
      '200': {
        description: 'Translation.User DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.translationRepository.users(id).delete(where);
  }
}
