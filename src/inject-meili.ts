import { Inject } from "@nestjs/common";

export const getMeiliIndexToken = (indexName: string) =>
  `MEILI_INDEX_${indexName.toUpperCase()}`;

export const InjectMeiliIndex = (indexName: string) =>
  Inject(getMeiliIndexToken(indexName));
