import { MeiliClient } from "./client";
import { Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import {
  MEILI_INDEX_RANKING_RULES,
  MEILI_INDEX_STOP_WORDS,
  MEILI_INDEX_SYNONYMS,
  MEILI_INDEX_DISTINCT,
  MEILI_INDEX_PAGINATION,
  MEILI_INDEX_FACETING,
  MEILI_INDEX_DISPLAYED,
  MEILI_INDEX_WATERMARK,
  MEILI_INDEX_SEARCHABLE_WATERMARK,
  MEILI_INDEX_FILTERABLE_WATERMARK,
  MEILI_INDEX_SORTABLE_WATERMARK,
} from "./watermarks";

@Injectable()
export class MeiliUtils {
  constructor(private readonly reflector: Reflector) {}

  async setupIndex(modelClass: any): Promise<void> {
    const indexName = this.reflector.get<string>(
      MEILI_INDEX_WATERMARK,
      modelClass
    );
    if (!indexName) {
      throw new Error(`Index name for ${modelClass.name} not found.`);
    }

    const meiliIndex = MeiliClient.prototype.index(indexName);
    const settings: any = {};

    settings.searchableAttributes = this.collectProps(
      modelClass,
      MEILI_INDEX_SEARCHABLE_WATERMARK
    );
    settings.filterableAttributes = this.collectProps(
      modelClass,
      MEILI_INDEX_FILTERABLE_WATERMARK
    );
    settings.sortableAttributes = this.collectProps(
      modelClass,
      MEILI_INDEX_SORTABLE_WATERMARK
    );

    const ranking = this.reflector.get(MEILI_INDEX_RANKING_RULES, modelClass);
    const stopWords = this.reflector.get(MEILI_INDEX_STOP_WORDS, modelClass);
    const synonyms = this.reflector.get(MEILI_INDEX_SYNONYMS, modelClass);
    const distinct = this.reflector.get(MEILI_INDEX_DISTINCT, modelClass);
    const pagination = this.reflector.get(MEILI_INDEX_PAGINATION, modelClass);
    const faceting = this.reflector.get(MEILI_INDEX_FACETING, modelClass);
    const displayed = this.reflector.get(MEILI_INDEX_DISPLAYED, modelClass);

    if (ranking) settings.rankingRules = ranking;
    if (stopWords) settings.stopWords = stopWords;
    if (synonyms) settings.synonyms = synonyms;
    if (displayed?.length) settings.displayedAttributes = displayed;
    if (distinct) settings.distinctAttribute = distinct;
    if (pagination) settings.pagination = { maxTotalHits: pagination };
    if (faceting) settings.faceting = { maxValuesPerFacet: faceting };

    try {
      await meiliIndex.updateSettings(settings);
    } catch (error) {
      throw new Error(
        `Failed to update settings for index ${indexName}: ${
          error instanceof Error ? error.message : "unknown error"
        }`
      );
    }
  }

  private collectProps(modelClass: any, watermark: string): string[] {
    const prototype = modelClass.prototype;
    return Object.getOwnPropertyNames(prototype).filter((key) =>
      Reflect.getMetadata(watermark, prototype, key)
    );
  }
}
