import { prepareDataScraperInput } from '../src/handler'

describe('prepareDataScraperInput', () => {

  test.each`
  startYear | endYear | expected
  ${2021}   | ${2022} | ${[
      {
        'endDate': '2021-02-01',
        'startDate': '2021-01-01',
      },
      {
        'endDate': '2021-03-01',
        'startDate': '2021-02-01',
      },
      {
        'endDate': '2021-04-01',
        'startDate': '2021-03-01',
      },
      {
        'endDate': '2021-05-01',
        'startDate': '2021-04-01',
      },
      {
        'endDate': '2021-06-01',
        'startDate': '2021-05-01',
      },
      {
        'endDate': '2021-07-01',
        'startDate': '2021-06-01',
      },
      {
        'endDate': '2021-08-01',
        'startDate': '2021-07-01',
      },
      {
        'endDate': '2021-09-01',
        'startDate': '2021-08-01',
      },
      {
        'endDate': '2021-10-01',
        'startDate': '2021-09-01',
      },
      {
        'endDate': '2021-11-01',
        'startDate': '2021-10-01',
      },
      {
        'endDate': '2021-12-01',
        'startDate': '2021-11-01',
      },
      {
        'endDate': '2022-01-01',
        'startDate': '2021-12-01',
      },
      {
        'endDate': '2022-02-01',
        'startDate': '2022-01-01',
      },
      {
        'endDate': '2022-03-01',
        'startDate': '2022-02-01',
      },
      {
        'endDate': '2022-04-01',
        'startDate': '2022-03-01',
      },
      {
        'endDate': '2022-05-01',
        'startDate': '2022-04-01',
      },
      {
        'endDate': '2022-06-01',
        'startDate': '2022-05-01',
      },
      {
        'endDate': '2022-07-01',
        'startDate': '2022-06-01',
      },
      {
        'endDate': '2022-08-01',
        'startDate': '2022-07-01',
      },
      {
        'endDate': '2022-09-01',
        'startDate': '2022-08-01',
      },
      {
        'endDate': '2022-10-01',
        'startDate': '2022-09-01',
      },
      {
        'endDate': '2022-11-01',
        'startDate': '2022-10-01',
      },
      {
        'endDate': '2022-12-01',
        'startDate': '2022-11-01',
      },
      {
        'endDate': '2023-01-01',
        'startDate': '2022-12-01',
      },
    ]
    }
  `('all date ranges', ({ startYear, endYear, expected }) => {
      const result = prepareDataScraperInput({ startYear, endYear })
      expect(result).toStrictEqual(expected)
    })
})