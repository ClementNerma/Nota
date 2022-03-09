import { EntityRepository, FilterQuery, FindOptions } from '@mikro-orm/core'
import { OperatorMap } from '@mikro-orm/core/typings'
import { Field, InputType, ObjectType } from '@nestjs/graphql'

export interface PaginatedType<TItem> {
  items: TItem[]
  hasMore: boolean
  prevCursor?: Date
  nextCursor?: Date
}

export function PaginatedResponse<TItem>(TItemClass: new () => TItem): abstract new () => PaginatedType<TItem> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass implements PaginatedType<TItem> {
    @Field(() => [TItemClass])
    items!: TItem[]

    @Field()
    hasMore!: boolean

    @Field({ nullable: true })
    prevCursor?: Date

    @Field({ nullable: true })
    nextCursor?: Date
  }

  return PaginatedResponseClass
}

@InputType()
export class PaginationInput {
  @Field(() => Date, { nullable: true })
  cursor!: Date | null

  @Field()
  limit!: number

  @Field({ defaultValue: true })
  asc!: boolean
}

export async function paginatedQuery<
  T extends { createdAt: Date },
  F extends FilterQuery<T> & { createdAt?: OperatorMap<Date> },
>(
  repo: EntityRepository<T>,
  filters: F,
  pagination: PaginationInput,
  options?: FindOptions<T>,
): Promise<PaginatedType<T>> {
  if (pagination.cursor) {
    filters.createdAt = pagination.asc ? { $gte: pagination.cursor } : { $lt: pagination.cursor }
  }

  const items = await repo.find(filters, {
    ...options,
    limit: pagination.limit + 1,
  })

  const hasMore = items.length > pagination.limit

  return {
    items: items.slice(0, pagination.limit),
    hasMore,
    prevCursor: items.length > 0 ? items[0].createdAt : undefined,
    nextCursor: hasMore ? items[items.length - 1].createdAt : undefined,
  }
}
