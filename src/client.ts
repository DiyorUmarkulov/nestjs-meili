import { MeiliSearch } from "meilisearch";

export class MeiliClient {
  client: MeiliSearch;

  constructor(host: string, apiKey: string) {
    this.client = new MeiliSearch({ host, apiKey });
  }

  public index(name: string) {
    return this.client.index(name);
  }
}
