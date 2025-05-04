import {MongoClient} from 'mongodb';

export class MongoRepo {
    private static instance: MongoRepo;
    private mongoClient: MongoClient;

    private constructor() {
        this.mongoClient = new MongoClient('mongodb://localhost:27017');
    }

    public static getInstance(): MongoRepo {
        if (!MongoRepo.instance) {
        MongoRepo.instance = new MongoRepo();
        }
        return MongoRepo.instance;
    }

    public async connect() {
        // Implement your connection logic here
    }

    public async disconnect() {
        // Implement your disconnection logic here
    }
}
