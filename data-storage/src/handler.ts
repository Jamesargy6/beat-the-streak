import { AWS_REGION } from './constants'
import { makeDynamoClient } from './dynamoDB/client.factory'
import { toGameIndex, toDynamoPlays } from './dynamoDB/transform'

type WritePlaysToDynamoInput = {
  date: string,
  gameNumber: number,
  plays: Array<{ batterId: number }>
}
const writePlaysToDynamo = async (event: WritePlaysToDynamoInput) => {
  const dynamoClient = makeDynamoClient(AWS_REGION)
  const { date, gameNumber, plays } = event
  const gameIndex = toGameIndex(date, gameNumber)
  const dynamoPlays = toDynamoPlays(gameIndex, plays)
  await dynamoClient.writePlays(dynamoPlays)
}

export { writePlaysToDynamo }
