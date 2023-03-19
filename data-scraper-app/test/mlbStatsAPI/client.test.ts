import { GameType, ScheduleHydrationOptions, PlayByPlay, Schedule, SportID, ScheduleFieldOptions, PlayByPlayFieldOptions } from 'mlb-stats-api'
import { MLBStatsAPIClient } from '../../src/mlbStatsAPI/client'

describe('MLBStatsAPIClient', () => {
  const testSchedule: Schedule = { dates: [] }
  const testPlayByPlay: PlayByPlay = { allPlays: [] }

    
  let mockGetSchedule, mockGetGamePlayByPlay, mockGetGameBoxscore, mockGetGameContextMetrics, mockClient
  beforeEach(() => {
    jest.resetAllMocks()
    mockGetSchedule = jest.fn(async (_) => ({ data: testSchedule }))
    mockGetGamePlayByPlay = jest.fn(async (_) => ({ data: testPlayByPlay }))
    mockClient = { 
      getSchedule: mockGetSchedule,
      getGamePlayByPlay: mockGetGamePlayByPlay,
      getGameBoxscore: mockGetGameBoxscore,
      getGameContextMetrics: mockGetGameContextMetrics
    }
  })

  const getThing = () => new MLBStatsAPIClient(mockClient)

  test('wiring', () => {
    const thing = getThing()
    expect(thing._client).toBe(mockClient)
  })

  describe('getRegularSeasonScheduleByYear', () => {
    const startDate = '2022-01-31'
    const endDate = '2022-12-31'
    const hydrationOptions = [
      ScheduleHydrationOptions.Lineups,
      ScheduleHydrationOptions.Venue,
      ScheduleHydrationOptions.Weather,
      ScheduleHydrationOptions.ProbablePitcher
    ]
    const fieldsOptions = [
      ScheduleFieldOptions.Dates,
      ScheduleFieldOptions.Date,
      ScheduleFieldOptions.Games,
      ScheduleFieldOptions.GamePk,
      ScheduleFieldOptions.OfficialDate,
      ScheduleFieldOptions.GameNumber,
      ScheduleFieldOptions.Venue,
      ScheduleFieldOptions.Id,
      ScheduleFieldOptions.Weather,
      ScheduleFieldOptions.Condition,
      ScheduleFieldOptions.Temp,
      ScheduleFieldOptions.Wind,
      ScheduleFieldOptions.Teams,
      ScheduleFieldOptions.Away,
      ScheduleFieldOptions.Home,
      ScheduleFieldOptions.ProbablePitcher,
      ScheduleFieldOptions.Lineups,
      ScheduleFieldOptions.HomePlayers,
      ScheduleFieldOptions.AwayPlayers
    ]
    const expectedParams = {
      sportId: SportID.MLB,
      startDate,
      endDate,
      gameType: GameType.RegularSeason,
      hydrate: hydrationOptions.join(','),
      fields: fieldsOptions.join(',')
    }
    
    test('happy path', async () => {
      const thing = getThing()
      const result = await thing.getRegularSeasonGames(startDate, endDate)
      expect(mockGetSchedule).toHaveBeenCalledWith({ params: expectedParams })
      expect(result).toBe(testSchedule)
    })
  })

  describe('getPlayByPlay', () => {
    const testGamePk = 662766
    const expectedPathParams = {
      gamePk: testGamePk
    }
    const fieldsOptions = [
      PlayByPlayFieldOptions.AllPlays,
      PlayByPlayFieldOptions.Result,
      PlayByPlayFieldOptions.EventType,
      PlayByPlayFieldOptions.About,
      PlayByPlayFieldOptions.IsComplete,
      PlayByPlayFieldOptions.Matchup,
      PlayByPlayFieldOptions.Batter,
      PlayByPlayFieldOptions.Id,
      PlayByPlayFieldOptions.BatSide,
      PlayByPlayFieldOptions.Code,
      PlayByPlayFieldOptions.Pitcher,
      PlayByPlayFieldOptions.PitchHand
    ]
    const expectedParams = { fields: fieldsOptions.join(',') }
    
    test('happy path', async () => {
      const thing = getThing()
      const result = await thing.getPlayByPlay(testGamePk)
      expect(mockGetGamePlayByPlay).toHaveBeenCalledWith({ pathParams: expectedPathParams, params: expectedParams })
      expect(result).toBe(testPlayByPlay)
    })
  })
})
