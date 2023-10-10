import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Translation} from '../models';
import {TranslationRepository} from '../repositories';

@authenticate('jwt')
export class TranslationController {
  constructor(
    @repository(TranslationRepository)
    public translationRepository: TranslationRepository,
  ) {}

  @post('/translations')
  @response(200, {
    description: 'Translation model instance',
    content: {'application/json': {schema: getModelSchemaRef(Translation)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Translation, {
            title: 'NewTranslation',
            exclude: ['id'],
          }),
        },
      },
    })
    translation: Omit<Translation, 'id'>,
  ): Promise<Translation> {
    return this.translationRepository.create(translation);
  }

  @get('/translations/count')
  @response(200, {
    description: 'Translation model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Translation) where?: Where<Translation>,
  ): Promise<Count> {
    return this.translationRepository.count(where);
  }

  @get('/translations')
  @response(200, {
    description: 'Array of Translation model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Translation, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Translation) filter?: Filter<Translation>,
  ): Promise<Translation[]> {
    return this.translationRepository.find(filter);
  }

  @patch('/translations')
  @response(200, {
    description: 'Translation PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Translation, {partial: true}),
        },
      },
    })
    translation: Translation,
    @param.where(Translation) where?: Where<Translation>,
  ): Promise<Count> {
    return this.translationRepository.updateAll(translation, where);
  }

  @get('/translations/{id}')
  @response(200, {
    description: 'Translation model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Translation, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Translation, {exclude: 'where'})
    filter?: FilterExcludingWhere<Translation>,
  ): Promise<Translation> {
    return this.translationRepository.findById(id, filter);
  }

  @patch('/translations/{id}')
  @response(204, {
    description: 'Translation PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Translation, {partial: true}),
        },
      },
    })
    translation: Translation,
  ): Promise<void> {
    await this.translationRepository.updateById(id, translation);
  }

  @put('/translations/{id}')
  @response(204, {
    description: 'Translation PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() translation: Translation,
  ): Promise<void> {
    await this.translationRepository.replaceById(id, translation);
  }

  @del('/translations/{id}')
  @response(204, {
    description: 'Translation DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.translationRepository.deleteById(id);
  }
}
