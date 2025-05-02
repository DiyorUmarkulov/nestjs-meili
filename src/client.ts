import { MeiliSearch } from "meilisearch";

export class MeiliClient {
  client: MeiliSearch;

  constructor(host: string, apiKey: string) {
    if (typeof host !== "string" || typeof apiKey !== "string") {
      throw new Error("Both host and apiKey must be strings.");
    }

    this.client = new MeiliSearch({ host, apiKey });
  }
  public async initIndex(name: string, primaryKey?: string) {
    if (!this.client) {
      throw new Error("Client is not initialized yet.");
    }

    let index = this.client.index(name);

    try {
      await index.getStats();
    } catch (error) {
      if (error.message.includes("Index not found")) {
        await this.client.createIndex(name, { primaryKey });
        index = this.client.index(name);
      } else {
        throw new Error(`Error initializing index: ${error.message}`);
      }
    }

    return index;
  }
}
