import { AWS_REGION } from './constants'
import { makeDynamoClient } from './dynamoDB/client.factory'
import { toPlayId } from './dynamoDB/transform'

type WritePlaysToDynamoInput = {
  date: string,
  gameNumber: number,
  playNumber: number,
  plays: Array<{ playerId: number }>
}
const writePlaysToDynamo = async (event: WritePlaysToDynamoInput) => {
  const dynamoClient = makeDynamoClient(AWS_REGION)
  const { date, gameNumber, playNumber, plays } = event
  const playId = toPlayId(date, gameNumber, playNumber)
  await dynamoClient.writePlays(playId, plays)
}

export { writePlaysToDynamo }
