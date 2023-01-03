const PLAY_NUMBER_FORMAT_LENGTH = 3

const toPlayId = (date: string, gameNumber: number, playNumber: number): string => {
  const formattedPlayNumber = String(playNumber).padStart(PLAY_NUMBER_FORMAT_LENGTH, '0')
  const playId = `${date}:${gameNumber}:${formattedPlayNumber}`
  return playId
}

export { toPlayId }
