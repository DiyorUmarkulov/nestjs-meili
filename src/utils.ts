import { MeiliClient } from "./client";
import { Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class MeiliUtils {
  constructor(private readonly reflector: Reflector) {}

  async setupIndex(modelClass: any) {
    const indexName = this.reflector.get<string>("meiliIndex", modelClass);
    const searchable = this.reflector.get("searchable", modelClass);
    const filterable = this.reflector.get("filterable", modelClass);
    const sortable = this.reflector.get("sortable", modelClass);

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
