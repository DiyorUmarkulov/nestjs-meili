import { SetMetadata } from "@nestjs/common";
import {
  MEILI_INDEX_FILTERABLE_WATERMARK,
  MEILI_INDEX_SEARCHABLE_WATERMARK,
  MEILI_INDEX_SORTABLE_WATERMARK,
  MEILI_INDEX_WATERMARK,
} from "./watermarks";

export const MeiliIndex = (index: string) =>
  SetMetadata(MEILI_INDEX_WATERMARK, index);

export const Searchable = () =>
  SetMetadata(MEILI_INDEX_SEARCHABLE_WATERMARK, true);

export const Filterable = () =>
  SetMetadata(MEILI_INDEX_FILTERABLE_WATERMARK, true);

export const Sortable = () => SetMetadata(MEILI_INDEX_SORTABLE_WATERMARK, true);
