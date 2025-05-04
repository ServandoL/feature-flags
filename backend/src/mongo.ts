import {Db, Document, MongoClient} from 'mongodb';

export class MongoRepo {
  private static _instance: MongoRepo;
  private readonly _mongoClient: MongoClient;
  private readonly _db: Db;

  private constructor() {
    this._mongoClient = new MongoClient(process.env['MONGO_URL'] ?? 'mongodb://localhost:27017');
    this._db = this._mongoClient.db(process.env['MONGO_DB'] ?? 'test');
    this._mongoClient.on('connect', () => {
      console.log('MongoDB connected');
    }).on('connectionReady', () => {
      console.log('MongoDB connection ready');
    }).on('connectionClosed', () => {
      console.log('MongoDB connection closed');
    }).on('error', (error) => {
      console.error('MongoDB connection error', error);
    })
  }

  public static get instance(): MongoRepo {
    if (!MongoRepo._instance) {
      MongoRepo._instance = new MongoRepo();
    }
    return MongoRepo._instance;
  }

  public collection<T extends Document = Document>(name: string) {
    return this._db.collection<T>(name);
  }

  static async connect() {
    // Implement your connection logic here
    if (!MongoRepo._instance) {
      this._instance = new MongoRepo();
    }
    await MongoRepo._instance._mongoClient.connect();
  }
}
