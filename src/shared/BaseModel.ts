import { ObjectId } from 'mongodb';

export interface BaseModel {
  _id: ObjectId;
  createdOn: UnixTime;
}

export type WithOptionalId<T extends { _id: ObjectId }> = Optional<T, '_id'>;
