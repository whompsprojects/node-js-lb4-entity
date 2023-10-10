import {Entity, model, property} from '@loopback/repository';

@model()
export class Translation extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  key: string;

  @property({
    type: 'string',
  })
  value_hi?: string;

  @property({
    type: 'string',
  })
  value_ar?: string;

  @property({
    type: 'string',
  })
  value_zh?: string;

  @property({
    type: 'number',
    required: true,
  })
  created_by: number;

  @property({
    type: 'date',
    default: new Date(),
  })
  created_on?: string;

  @property({
    type: 'date',
  })
  last_updated_on?: string;

  constructor(data?: Partial<Translation>) {
    super(data);
  }
}

export interface TranslationRelations {
  // describe navigational properties here
}

export type TranslationWithRelations = Translation & TranslationRelations;
