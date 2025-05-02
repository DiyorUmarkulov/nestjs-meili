import { MeiliSearch } from "meilisearch";

export class MeiliClient {
  client: MeiliSearch;

  constructor(host: string, apiKey: string) {
    if (typeof host !== "string" || typeof apiKey !== "string") {
      throw new Error("Both host and apiKey must be strings.");
    }

    this.client = new MeiliSearch({ host, apiKey });
  }

  public index(name: string) {
    return this.client.index(name);
  }
}
