import { toPlayId } from '../../src/dynamoDB/transform'

test.each`
date            | gameNumber  | playNumber  | expectedPlayId
${'2022-04-01'} | ${1}        | ${1}        | ${'2022-04-01:1:001'}
${'2022-04-01'} | ${1}        | ${16}       | ${'2022-04-01:1:016'}
${'2022-04-01'} | ${2}        | ${999}      | ${'2022-04-01:2:999'}
`('transforms input into playId', ({ date, gameNumber, playNumber, expectedPlayId }) => {
  const result = toPlayId(date, gameNumber, playNumber)
  expect(result).toBe(expectedPlayId)
})
