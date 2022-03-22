import { InputType, registerEnumType } from '@nestjs/graphql'

@InputType()
export class CorrespondenceTokenCreateInputDTO {
  lifespan!: CorrespondentTokenLifespan
}

export enum CorrespondentTokenLifespan {
  FiveMinutes = 'FiveMinutes',
  TenMinutes = 'TenMinutes',
  ThirtyMinutes = 'ThirtyMinutes',
  OneHour = 'OneHour',
  TwoHours = 'TwoHours',
  TwelveHours = 'TwelveHours',
  OneDay = 'OneDay',
  TwoDays = 'TwoDays',
  OneWeek = 'OneWeek',
  TwoWeeks = 'TwoWeeks',
}

registerEnumType(CorrespondentTokenLifespan, {
  name: 'CorrespondentTokenLifespan',
})

export const getCorrespondenceTokenLifespanInMilliseconds = (lifespan: CorrespondentTokenLifespan): number => {
  switch (lifespan) {
    case CorrespondentTokenLifespan.FiveMinutes:
      return 1000 * 60 * 5

    case CorrespondentTokenLifespan.TenMinutes:
      return 1000 * 60 * 10

    case CorrespondentTokenLifespan.ThirtyMinutes:
      return 1000 * 60 * 30

    case CorrespondentTokenLifespan.OneHour:
      return 1000 * 60 * 60

    case CorrespondentTokenLifespan.TwoHours:
      return 1000 * 60 * 60 * 2

    case CorrespondentTokenLifespan.TwelveHours:
      return 1000 * 60 * 60 * 12

    case CorrespondentTokenLifespan.OneDay:
      return 1000 * 60 * 60 * 24

    case CorrespondentTokenLifespan.TwoDays:
      return 1000 * 60 * 60 * 24 * 2

    case CorrespondentTokenLifespan.OneWeek:
      return 1000 * 60 * 60 * 24 * 7

    case CorrespondentTokenLifespan.TwoWeeks:
      return 1000 * 60 * 60 * 24 * 14
  }
}
