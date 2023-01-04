import { AWS_REGION } from './constants'
import { makeDynamoClient } from './dynamoDB/client.factory'
import { toDynamoPlays } from './dynamoDB/transform'

type WritePlaysToDynamoInput = {
  date: string,
  gameNumber: number,
  plays: Array<{ playerId: number }>
}
const writePlaysToDynamo = async (event: WritePlaysToDynamoInput) => {
  const dynamoClient = makeDynamoClient(AWS_REGION)
  const { date, gameNumber, plays } = event
  const dynamoPlays = toDynamoPlays(date, gameNumber, plays)
  await dynamoClient.writePlays(dynamoPlays)
}

export { writePlaysToDynamo }
