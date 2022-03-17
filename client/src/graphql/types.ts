export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type Correspondent = {
  __typename?: 'Correspondent';
  encDisplayName: Scalars['String'];
  encPublicKey: Scalars['String'];
  selfPermissions: ExchangePermissions;
  serverUrl: Scalars['String'];
  userApiKey: Scalars['String'];
  userPermissions: ExchangePermissions;
  uuid: Scalars['String'];
};

export type CorrespondentCreateInputDto = {
  encDisplayName: Scalars['String'];
  encPublicKey: Scalars['String'];
  selfPermissions: ExchangePermissionsInput;
  serverUrl: Scalars['String'];
  userApiKey: Scalars['String'];
  userPermissions: ExchangePermissionsInput;
};

export type CorrespondentCreatedDto = {
  __typename?: 'CorrespondentCreatedDTO';
  apiKey: Scalars['String'];
};

export type EncryptedMessageData = {
  __typename?: 'EncryptedMessageData';
  encCategory?: Maybe<Scalars['String']>;
  encContent: Scalars['String'];
  encNotificationData?: Maybe<EncryptedNotificationData>;
  encReplyingToMessageId?: Maybe<Scalars['String']>;
  encSenderName: Scalars['String'];
  encSubject: Scalars['String'];
};

export type EncryptedMessageDataInput = {
  encCategory?: InputMaybe<Scalars['String']>;
  encContent: Scalars['String'];
  encNotificationData?: InputMaybe<EncryptedNotificationDataInput>;
  encReplyingToMessageId?: InputMaybe<Scalars['String']>;
  encSenderName: Scalars['String'];
  encSubject: Scalars['String'];
};

export type EncryptedNotificationData = {
  __typename?: 'EncryptedNotificationData';
  encShowUrlOnClick?: Maybe<Scalars['String']>;
  encUrgency: NotificationUrgency;
};

export type EncryptedNotificationDataInput = {
  encShowUrlOnClick?: InputMaybe<Scalars['String']>;
  encUrgency: NotificationUrgency;
};

export type ExchangePermissions = {
  __typename?: 'ExchangePermissions';
  canSendMessages: Scalars['Boolean'];
};

export type ExchangePermissionsInput = {
  canSendMessages: Scalars['Boolean'];
};

export type GetMessageInput = {
  markAsRead?: InputMaybe<Scalars['Boolean']>;
  messageId: Scalars['String'];
};

export type Message = {
  __typename?: 'Message';
  attributes: MessageAttributes;
  correspondent: Correspondent;
  createdAt: Scalars['DateTime'];
  direction: MessageDirection;
  encryptedData: EncryptedMessageData;
  receivedAt: Scalars['DateTime'];
  uuid: Scalars['String'];
};

export type MessageAttributes = {
  __typename?: 'MessageAttributes';
  archived: Scalars['Boolean'];
  encCategory?: Maybe<Scalars['String']>;
  read: Scalars['Boolean'];
};

export enum MessageDirection {
  CorrespondentToUser = 'CORRESPONDENT_TO_USER',
  UserToCorrespondent = 'USER_TO_CORRESPONDENT'
}

export type MessageSearchInput = {
  correspondentId?: InputMaybe<Scalars['String']>;
  direction?: InputMaybe<MessageDirection>;
  encCategory?: InputMaybe<Scalars['String']>;
  encSenderName?: InputMaybe<Scalars['String']>;
  fromDate?: InputMaybe<Scalars['DateTime']>;
  isNotification?: InputMaybe<Scalars['Boolean']>;
  notificationUrgency?: InputMaybe<NotificationUrgency>;
  toDate?: InputMaybe<Scalars['DateTime']>;
};

export type MessageSendInputDto = {
  encryptedData: EncryptedMessageDataInput;
};

export type MessageSendToExternalInputDto = {
  correspondentId: Scalars['String'];
  encryptedData: EncryptedMessageDataInput;
};

export type MessageSentDto = {
  __typename?: 'MessageSentDTO';
  messageId: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCorrespondent: CorrespondentCreatedDto;
  login: Scalars['String'];
  register: User;
  sendMessage: MessageSentDto;
  sendMessageToExternal: MessageSentDto;
  setMessageAttributes: MessageAttributes;
};


export type MutationCreateCorrespondentArgs = {
  input: CorrespondentCreateInputDto;
};


export type MutationLoginArgs = {
  input: UserLoginDto;
};


export type MutationRegisterArgs = {
  input: UserCreateDto;
};


export type MutationSendMessageArgs = {
  input: MessageSendInputDto;
};


export type MutationSendMessageToExternalArgs = {
  input: MessageSendToExternalInputDto;
};


export type MutationSetMessageAttributesArgs = {
  input: SetMessageAttributesInput;
};

export enum NotificationUrgency {
  DoNotDisturb = 'DO_NOT_DISTURB',
  High = 'HIGH',
  Normal = 'NORMAL',
  Urgent = 'URGENT'
}

export type PaginatedMessages = {
  __typename?: 'PaginatedMessages';
  hasMore: Scalars['Boolean'];
  items: Array<Message>;
  nextCursor?: Maybe<Scalars['DateTime']>;
  prevCursor?: Maybe<Scalars['DateTime']>;
};

export type PaginationInput = {
  asc?: InputMaybe<Scalars['Boolean']>;
  cursor?: InputMaybe<Scalars['DateTime']>;
  limit: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  getMessage: Message;
  getPermissions: ExchangePermissions;
  myMessages: PaginatedMessages;
  searchMessages: PaginatedMessages;
  viewer?: Maybe<User>;
};


export type QueryGetMessageArgs = {
  input: GetMessageInput;
};


export type QueryMyMessagesArgs = {
  paginate: PaginationInput;
};


export type QuerySearchMessagesArgs = {
  input: MessageSearchInput;
  pagination: PaginationInput;
};

export type SetMessageAttributesInput = {
  archived?: InputMaybe<Scalars['Boolean']>;
  encCategory?: InputMaybe<Scalars['String']>;
  messageId: Scalars['String'];
  read?: InputMaybe<Scalars['Boolean']>;
};

export type User = {
  __typename?: 'User';
  correspondents: Array<Correspondent>;
  encPrivateKey: Scalars['String'];
  encPublicName: Scalars['String'];
  encUsername: Scalars['String'];
  publicKey: Scalars['String'];
  uuid: Scalars['String'];
};

export type UserCreateDto = {
  encPrivateKey: Scalars['String'];
  encPublicName: Scalars['String'];
  encUsername: Scalars['String'];
  passwordHash: Scalars['String'];
  publicKey: Scalars['String'];
};

export type UserLoginDto = {
  encUsername: Scalars['String'];
  passwordHash: Scalars['String'];
};

export type HomeQueryVariables = Exact<{
  paginate: PaginationInput;
}>;


export type HomeQuery = { __typename?: 'Query', myMessages: { __typename?: 'PaginatedMessages', hasMore: boolean, prevCursor?: any | null, nextCursor?: any | null, items: Array<{ __typename?: 'Message', uuid: string, correspondent: { __typename?: 'Correspondent', uuid: string, encDisplayName: string }, encryptedData: { __typename?: 'EncryptedMessageData', encSenderName: string, encSubject: string, encReplyingToMessageId?: string | null, encCategory?: string | null, encContent: string, encNotificationData?: { __typename?: 'EncryptedNotificationData', encUrgency: NotificationUrgency, encShowUrlOnClick?: string | null } | null } }> } };
