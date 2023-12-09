import {
  Db,
  Filter,
  FindOptions,
  OptionalUnlessRequiredId,
  UpdateFilter,
} from 'mongodb';
import { BaseModel } from './BaseModel';

interface Deps {
  db: Db;
}

export abstract class BaseRepository<T extends BaseModel> {
  abstract readonly collectionName: string;

  public db: Db;

  constructor({ db }: Deps) {
    this.db = db;
  }

  public get collection() {
    return this.db.collection<T>(this.collectionName);
  }

  public findOne(filter: Filter<T>, options?: FindOptions) {
    return this.collection.findOne(filter, options);
  }

  public findMany(filter: Filter<T>, options?: FindOptions) {
    return this.collection.find(filter, options);
  }

  public insertOne(item: OptionalUnlessRequiredId<T>) {
    return this.collection.insertOne(item);
  }

  public insertMany(item: OptionalUnlessRequiredId<T>[]) {
    return this.collection.insertMany(item);
  }

  public updateOne(filter: Filter<T>, item: UpdateFilter<T> | Partial<T>) {
    return this.collection.updateOne(filter, item);
  }

  public updateMany(filter: Filter<T>, item: UpdateFilter<T>) {
    return this.collection.updateMany(filter, item);
  }

  public deleteOne(filter: Filter<T>) {
    return this.collection.deleteOne(filter);
  }

  public deleteMany(filter: Filter<T>) {
    return this.collection.deleteMany(filter);
  }
}
