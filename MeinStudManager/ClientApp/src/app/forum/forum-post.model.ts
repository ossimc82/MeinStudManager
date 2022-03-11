export interface ForumTopic {
  id?: string;
  title: string;
  lastReply: string;
}

export interface ForumReply {
  id: string,
  topicId: string,
  authorId: string,
  creationDate: string,
  numberOfEdits: number,
  lastEdit: string,
  title: string,
  content: string,
  numUpVotes: number,
  numDownVotes: number,
  authorName: string
}

export interface ForumTopicResultsContainer{
  count: number;
  page: number;
  totalCount: number;
  items: ForumTopic[];
}

export interface ForumReplyResultsContainer{
  count: number;
  page: number;
  totalCount: number;
  items: ForumReply[];
}


export interface ForumCreatorInput {
  title: string;
  content: string;
}




export enum EditorPurposeTypes {
  newTopic,
  newReply,
  replyEdit,
  directReply
}
export interface EditorPurposeData{
  type: EditorPurposeTypes;
  replyRef?: ForumReply;
}
