import { MongoClient } from "mongodb"

const MONGO_HOST = "167.172.174.4"
const MONGO_PORT = "56728"
export const connectToDb = async () => {
	const uri = `mongodb://${process.env.NEXT_PUBLIC_MONGO_PORT}`
	const client = new MongoClient(uri)

	await client.connect()
	const database = client.db("parse")
	return {
		database,
	}
}
