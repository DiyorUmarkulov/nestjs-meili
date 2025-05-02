import "reflect-metadata";
import {
  MEILI_INDEX_FILTERABLE_WATERMARK,
  MEILI_INDEX_SEARCHABLE_WATERMARK,
  MEILI_INDEX_SORTABLE_WATERMARK,
  MEILI_INDEX_WATERMARK,
} from "./watermarks";

export function MeiliIndex(index: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MEILI_INDEX_WATERMARK, index, target);
  };
}

export function Searchable(): PropertyDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(
      MEILI_INDEX_SEARCHABLE_WATERMARK,
      true,
      target,
      propertyKey
    );
  };
}

export function Filterable(): PropertyDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(
      MEILI_INDEX_FILTERABLE_WATERMARK,
      true,
      target,
      propertyKey
    );
  };
}

export function Sortable(): PropertyDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(
      MEILI_INDEX_SORTABLE_WATERMARK,
      true,
      target,
      propertyKey
    );
  };
}
