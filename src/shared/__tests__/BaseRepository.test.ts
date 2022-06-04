import { Db, ObjectId } from 'mongodb';
import { BaseModel } from '../BaseModel';
import { BaseRepository } from '../BaseRepository';

interface TestModel extends BaseModel {
  name: string;
}

function createTestModel(name: string) {
  const model: TestModel = {
    _id: new ObjectId(),
    name,
    createdOn: Date.now(),
  };
  return model;
}

class TestRepository extends BaseRepository<TestModel> {
  collectionName = 'test_collection';
}

describe('BaseRepository', () => {
  let db: Db;
  let repo: TestRepository;

  const singleItem = createTestModel('Mock name');
  const multipleItems = [createTestModel('Item 1'), createTestModel('Item 2')];

  beforeAll(() => {
    db = global.jestContext.db;
    repo = new TestRepository({ db });
  });

  it('should insert single item', async () => {
    await repo.insertOne(singleItem);

    const result = await db
      .collection(repo.collectionName)
      .findOne<TestModel>({ _id: singleItem._id });
    expect(result).toBeDefined();
    expect(result?.name).toBe(singleItem.name);
  });

  it('should insert multiple item', async () => {
    await repo.insertMany(multipleItems);

    for (const item of multipleItems) {
      const result = await db
        .collection(repo.collectionName)
        .findOne<TestModel>({ _id: item._id });
      expect(result).toBeDefined();
      expect(result?.name).toBe(item.name);
    }
  });

  it('should find one item', async () => {
    const result = await repo.findOne({ _id: singleItem._id });

    expect(result).toBeDefined();
    expect(result?.name).toBe(singleItem.name);
  });

  it('should find multiple items', async () => {
    const cursor = repo.findMany({
      $or: multipleItems.map(({ _id }) => ({ _id })),
    });

    while (await cursor.hasNext()) {
      const result = await cursor.next();
      expect(result).toBeDefined();
      expect(multipleItems.map(({ name }) => name)).toContain(result?.name);
    }
  });

  it('should update single item', async () => {
    const updatedName = 'updated name';
    await repo.updateOne(
      { _id: singleItem._id },
      { $set: { name: updatedName } }
    );

    const result = await db
      .collection(repo.collectionName)
      .findOne<TestModel>({ _id: singleItem._id });
    expect(result).toBeDefined();
    expect(result?.name).toBe(updatedName);
  });

  it('should update multiple item', async () => {
    const updatedName = 'updated multiple name';

    await repo.updateMany(
      { $or: multipleItems.map(({ _id }) => ({ _id })) },
      { $set: { name: updatedName } }
    );

    for (const item of multipleItems) {
      const result = await db
        .collection(repo.collectionName)
        .findOne<TestModel>({ _id: item._id });
      expect(result).toBeDefined();
      expect(result?.name).toBe(updatedName);
    }
  });

  it('should delete single item', async () => {
    await repo.deleteOne({ _id: singleItem._id });

    const result = await db
      .collection(repo.collectionName)
      .findOne<TestModel>({ _id: singleItem._id });
    expect(result).toBeNull();
  });

  it('should delete multiple item', async () => {
    await repo.deleteMany({ $or: multipleItems.map(({ _id }) => ({ _id })) });

    for (const item of multipleItems) {
      const result = await db
        .collection(repo.collectionName)
        .findOne<TestModel>({ _id: item._id });
      expect(result).toBeNull();
    }
  });
});
