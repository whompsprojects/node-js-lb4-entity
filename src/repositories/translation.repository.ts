import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Translation, TranslationRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class TranslationRepository extends DefaultCrudRepository<
  Translation,
  typeof Translation.prototype.id,
  TranslationRelations
> {

  public readonly users: HasManyRepositoryFactory<User, typeof Translation.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Translation, dataSource);
    this.users = this.createHasManyRepositoryFactoryFor('users', userRepositoryGetter,);
    this.registerInclusionResolver('users', this.users.inclusionResolver);
  }
}
