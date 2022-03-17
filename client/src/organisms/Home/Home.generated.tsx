import * as Types from '../../graphql/types';

import client from "src/apollo-client";
import type {
        ApolloQueryResult, ObservableQuery, WatchQueryOptions
      } from "@apollo/client";
import { readable } from "svelte/store";
import type { Readable } from "svelte/store";
import gql from "graphql-tag"
export type HomeQueryVariables = Types.Exact<{
  paginate: Types.PaginationInput;
}>;


export type HomeQuery = { __typename?: 'Query', myMessages: { __typename?: 'PaginatedMessages', hasMore: boolean, prevCursor?: any | null, nextCursor?: any | null, items: Array<{ __typename?: 'Message', uuid: string, correspondent: { __typename?: 'Correspondent', uuid: string, encDisplayName: string }, encryptedData: { __typename?: 'EncryptedMessageData', encSenderName: string, encSubject: string, encReplyingToMessageId?: string | null, encCategory?: string | null, encContent: string, encNotificationData?: { __typename?: 'EncryptedNotificationData', encUrgency: Types.NotificationUrgency, encShowUrlOnClick?: string | null } | null } }> } };


export const HomeDoc = gql`
    query Home($paginate: PaginationInput!) {
  myMessages(paginate: $paginate) {
    items {
      uuid
      correspondent {
        uuid
        encDisplayName
      }
      encryptedData {
        encSenderName
        encSubject
        encReplyingToMessageId
        encCategory
        encContent
        encNotificationData {
          encUrgency
          encShowUrlOnClick
        }
      }
    }
    hasMore
    prevCursor
    nextCursor
  }
}
    `;
export const Home = (
            options: Omit<
              WatchQueryOptions<HomeQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<HomeQuery> & {
              query: ObservableQuery<
                HomeQuery,
                HomeQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: HomeDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<HomeQuery> & {
                query: ObservableQuery<
                  HomeQuery,
                  HomeQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        