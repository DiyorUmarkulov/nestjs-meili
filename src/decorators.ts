import "reflect-metadata";
import {
  MEILI_INDEX_FILTERABLE,
  MEILI_INDEX_SEARCHABLE,
  MEILI_INDEX_SORTABLE,
  MEILI_INDEX,
  MEILI_INDEX_DISPLAYED,
  MEILI_INDEX_DISTINCT,
  MEILI_INDEX_FACETING,
  MEILI_INDEX_PAGINATION,
  MEILI_INDEX_RANKING_RULES,
  MEILI_INDEX_STOP_WORDS,
  MEILI_INDEX_SYNONYMS,
  MEILI_PRIMARY_KEY,
} from "./watermarks";

export function MeiliIndex(index: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MEILI_INDEX, index, target);
  };
}

export function Searchable(): PropertyDecorator {
  return (target, propertyKey) => {
    const searchableProps =
      Reflect.getMetadata(MEILI_INDEX_SEARCHABLE, target.constructor) || [];
    searchableProps.push(propertyKey.toString());
    Reflect.defineMetadata(
      MEILI_INDEX_SEARCHABLE,
      searchableProps,
      target.constructor
    );
  };
}

export function Filterable(): PropertyDecorator {
  return (target, propertyKey) => {
    const filterableProps =
      Reflect.getMetadata(MEILI_INDEX_FILTERABLE, target.constructor) || [];
    filterableProps.push(propertyKey.toString());
    Reflect.defineMetadata(
      MEILI_INDEX_FILTERABLE,
      filterableProps,
      target.constructor
    );
  };
}

export function Sortable(): PropertyDecorator {
  return (target, propertyKey) => {
    const sortableProps =
      Reflect.getMetadata(MEILI_INDEX_SORTABLE, target.constructor) || [];
    sortableProps.push(propertyKey.toString());
    Reflect.defineMetadata(
      MEILI_INDEX_SORTABLE,
      sortableProps,
      target.constructor
    );
  };
}

export function RankingRules(rules: string[]): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MEILI_INDEX_RANKING_RULES, rules, target);
  };
}

export function StopWords(words: string[]): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MEILI_INDEX_STOP_WORDS, words, target);
  };
}

export function Synonyms(map: Record<string, string[]>): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MEILI_INDEX_SYNONYMS, map, target);
  };
}

export function Pagination(maxTotalHits: number): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MEILI_INDEX_PAGINATION, maxTotalHits, target);
  };
}

export function Faceting(maxValuesPerFacet: number): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MEILI_INDEX_FACETING, maxValuesPerFacet, target);
  };
}

export function Displayed(): PropertyDecorator {
  return (target, propertyKey) => {
    const existing =
      Reflect.getMetadata(MEILI_INDEX_DISPLAYED, target.constructor) || [];
    Reflect.defineMetadata(
      MEILI_INDEX_DISPLAYED,
      [...new Set([...existing, propertyKey.toString()])],
      target.constructor
    );
  };
}

export function Distinct(): PropertyDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(
      MEILI_INDEX_DISTINCT,
      propertyKey.toString(),
      target.constructor
    );
  };
}

export function PrimaryKey(): PropertyDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(
      MEILI_PRIMARY_KEY,
      propertyKey.toString(),
      target.constructor
    );
  };
}
