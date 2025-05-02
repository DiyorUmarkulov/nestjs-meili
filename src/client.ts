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
    if (!this.client) {
      throw new Error("Client is not initialized yet.");
    }

    return this.client.index(name);
  }
}
