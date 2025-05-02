import { MeiliClient } from "./client";
import { Injectable, Type } from "@nestjs/common";
import {
  MEILI_PRIMARY_KEY,
  MEILI_INDEX_RANKING_RULES,
  MEILI_INDEX_STOP_WORDS,
  MEILI_INDEX_SYNONYMS,
  MEILI_INDEX_DISTINCT,
  MEILI_INDEX_PAGINATION,
  MEILI_INDEX_FACETING,
  MEILI_INDEX_DISPLAYED,
  MEILI_INDEX,
  MEILI_INDEX_SEARCHABLE,
  MEILI_INDEX_FILTERABLE,
  MEILI_INDEX_SORTABLE,
} from "./watermarks";
import { IndexOptions, Settings } from "meilisearch";

@Injectable()
export class MeiliUtils {
  async setupIndex(index: Type, client: MeiliClient): Promise<void> {
    const indexName = this.getIndexName(index);

    const primaryKey = Reflect.getMetadata(MEILI_PRIMARY_KEY, index);
    if (!primaryKey) {
      throw new Error(`Primary key for model ${index.name} is not set`);
    }

    try {
      const meiliIndex = await client.initIndex(indexName, primaryKey);
      const settings: Settings & IndexOptions = {
        primaryKey,
        searchableAttributes: this.collectProps(index, MEILI_INDEX_SEARCHABLE),
        filterableAttributes: this.collectProps(index, MEILI_INDEX_FILTERABLE),
        sortableAttributes: this.collectProps(index, MEILI_INDEX_SORTABLE),
      };

      this.addOptionalSettings(index, settings);

      await meiliIndex.updateSettings(settings);

      console.log(`Meili index for ${index.name} setup complete.`);
    } catch (error) {
      console.error(`Failed to setup Meili index for ${index.name}:`, error);
    }
  }

  private getIndexName(index: Type): string {
    const customName = Reflect.getMetadata(MEILI_INDEX, index);
    return customName || index.name.toLowerCase();
  }

  private collectProps(index: Type, watermark: string): string[] {
    const prototype = index.prototype;
    return Object.getOwnPropertyNames(prototype).filter((key) =>
      Reflect.getMetadata(watermark, prototype, key)
    );
  }

  private addOptionalSettings(
    index: Type,
    settings: Settings & IndexOptions
  ): void {
    const ranking = Reflect.getMetadata(MEILI_INDEX_RANKING_RULES, index);
    const stopWords = Reflect.getMetadata(MEILI_INDEX_STOP_WORDS, index);
    const synonyms = Reflect.getMetadata(MEILI_INDEX_SYNONYMS, index);
    const distinct = Reflect.getMetadata(MEILI_INDEX_DISTINCT, index);
    const pagination = Reflect.getMetadata(MEILI_INDEX_PAGINATION, index);
    const faceting = Reflect.getMetadata(MEILI_INDEX_FACETING, index);
    const displayed = Reflect.getMetadata(MEILI_INDEX_DISPLAYED, index);
    const primaryKey = Reflect.getMetadata(MEILI_PRIMARY_KEY, index);

    if (primaryKey) settings.primaryKey = primaryKey;
    if (ranking) settings.rankingRules = ranking;
    if (stopWords) settings.stopWords = stopWords;
    if (synonyms) settings.synonyms = synonyms;
    if (displayed?.length) settings.displayedAttributes = displayed;
    if (distinct) settings.distinctAttribute = distinct;
    if (pagination) settings.pagination = { maxTotalHits: pagination };
    if (faceting) settings.faceting = { maxValuesPerFacet: faceting };
  }
}
