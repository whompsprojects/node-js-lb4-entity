import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Language, LanguageRelations} from '../models';

export class LanguageRepository extends DefaultCrudRepository<
  Language,
  typeof Language.prototype.language_id,
  LanguageRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Language, dataSource);
  }
}
