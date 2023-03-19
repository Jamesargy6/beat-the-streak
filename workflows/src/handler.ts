import { DateRange } from './types'

type PrepareDataScraperInputInput = { startYear: number, endYear: number }
const prepareDataScraperInput = ({ startYear, endYear }: PrepareDataScraperInputInput): Array<DateRange> => {
  const yearRange = Array.from({ length: (endYear - startYear + 1) }, (_, k) => k + startYear)
  const monthRange = Array.from({ length: 12 }, (_, key) => key)

  return yearRange.map(year =>
    monthRange.map(month => ({
      startDate: new Date(year, month, 1).toLocaleDateString('en-CA'),
      endDate: new Date(year, month + 1, 1).toLocaleDateString('en-CA')
    }))
  ).reduce((accumulator, value) => accumulator.concat(value), [])
}

export { prepareDataScraperInput }