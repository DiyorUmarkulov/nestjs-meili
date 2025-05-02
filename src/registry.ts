import { Type } from "@nestjs/common";

export class MeiliRegistry {
  private static indexes: Type[] = [];

  static register(...indexes: Type[]) {
    this.indexes.push(...indexes);
  }

  static getIndexes() {
    return this.indexes;
  }
}
