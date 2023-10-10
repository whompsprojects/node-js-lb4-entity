import {Entity, model, property} from '@loopback/repository';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  user_id?: number;

  @property({
    type: 'string',
    required: true,
    unique: true,
  })
  email_id: string;

  @property({
    type: 'string',
    required: false,
    default: '',
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  pwd: string;

  @property({
    type: 'boolean',
    default: false,
  })
  is_active?: boolean;

  @property({
    type: 'date',
    required: true,
  })
  created_on: string;

  @property({
    type: 'date',
  })
  last_loggedin_date?: string;

  @property({
    type: 'number',
  })
  created_by?: number;

  @property.array(String)
  permissions: String[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
