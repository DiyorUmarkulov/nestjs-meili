import { MeiliClient } from "./client";
import { Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import {
  MEILI_INDEX_FILTERABLE_WATERMARK,
  MEILI_INDEX_SEARCHABLE_WATERMARK,
  MEILI_INDEX_SORTABLE_WATERMARK,
  MEILI_INDEX_WATERMARK,
} from "./watermarks";

@Injectable()
export class MeiliUtils {
  constructor(private readonly reflector: Reflector) {}

  async setupIndex(modelClass: any) {
    const indexName = this.reflector.get<string>(
      MEILI_INDEX_WATERMARK,
      modelClass
    );
    const searchable = this.reflector.get(
      MEILI_INDEX_SEARCHABLE_WATERMARK,
      modelClass
    );
    const filterable = this.reflector.get(
      MEILI_INDEX_FILTERABLE_WATERMARK,
      modelClass
    );
    const sortable = this.reflector.get(
      MEILI_INDEX_SORTABLE_WATERMARK,
      modelClass
    );

    const meiliIndex = MeiliClient.prototype.index(indexName);

    const settings: any = {};

    if (searchable) {
      settings.searchableAttributes = searchable;
    }
    if (filterable) {
      settings.filterableAttributes = filterable;
    }
    if (sortable) {
      settings.sortableAttributes = sortable;
    }

    await meiliIndex.updateSettings(settings);
  }
}
