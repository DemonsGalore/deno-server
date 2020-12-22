import { MongoClient } from './deps/mongo.ts';
import { config } from './deps/dotenv.ts';

const env = config();

// Connect do database
const client = new MongoClient();
client.connectWithUri(env.MONGODB_URI);

const db = client.database('deno');

export default db;
