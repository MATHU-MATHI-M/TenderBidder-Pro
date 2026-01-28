import { MongoClient, Db } from "mongodb"

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

// Debug (safe – hides password)
console.log(
  "DEBUG: MONGODB_URI is",
  uri.replace(/:([^:@]+)@/, ":****@")
)

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Extend global scope to cache Mongo client (important for Next.js)
const globalWithMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>
}

if (!globalWithMongo._mongoClientPromise) {
  client = new MongoClient(uri)
  globalWithMongo._mongoClientPromise = client.connect().then((client) => {
    console.log("✓ Connected to MongoDB")
    return client
  })
}

clientPromise = globalWithMongo._mongoClientPromise!

export default clientPromise

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db("tenderbidder")
}
