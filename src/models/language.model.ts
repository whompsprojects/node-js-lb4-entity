import {Entity, model, property} from '@loopback/repository';

@model()
export class Language extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  language_id?: number;

  @property({
    type: 'string',
    required: true,
    unique: true,
  })
  short_name: string;

  @property({
    type: 'string',
    required: true,
    unique: true,
  })
  name: string;

  constructor(data?: Partial<Language>) {
    super(data);
  }
}

export interface LanguageRelations {
  // describe navigational properties here
}

export type LanguageWithRelations = Language & LanguageRelations;
