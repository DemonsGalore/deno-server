import { MongoClient } from 'https://deno.land/x/mongo@v0.11.0/mod.ts';
import { config } from 'https://deno.land/x/dotenv@v0.5.0/mod.ts';

const env = config();

// Connect do database
const client = new MongoClient();
client.connectWithUri(env.MONGODB_URI);

const db = client.database('deno');

export default db;
