import { NextApiRequest, NextApiResponse } from "next"
import { connectToDb } from "./../../lib/mongodb"

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { title } = req.query
	console.log(req.query)
	if (!title) return res.status(200).json({ result: [] })
	const { database } = await connectToDb()

	const collection = database.collection("itemCreatedData")
	await collection.createIndex({ title: "text" })
	const result = await collection
		.aggregate([
			{ $match: { $text: { $search: `${title}` } } },
			{
				$lookup: {
					from: "ItemCreated",
					localField: "tokenURI",
					foreignField: "tokenURI",
					as: "nftData",
				},
			},
		])
		.toArray()
	return res.status(200).json({ result })
}
