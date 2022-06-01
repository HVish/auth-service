import { Client } from "../models/ClientModel";
import { BaseRepository } from "../shared/BaseRepository";

export default class ClientRepository extends BaseRepository<Client> {
  collectionName = 'client';
}
