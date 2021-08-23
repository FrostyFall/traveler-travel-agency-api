import dotenv from 'dotenv'
import { MongoClient } from "mongodb";
dotenv.config();

const client = new MongoClient(process.env.ATLAS_URI, { useUnifiedTopology: true });

(async () => {
  await client.connect();

  process.on('SIGINT', () => {
    client.close().then(() => {
      console.log('SIGINT: Closing database connection...');
      process.exit(0);
    })
  })
})()

export default client;