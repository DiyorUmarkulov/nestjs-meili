import {
  Module,
  DynamicModule,
  Provider,
  Global,
  ModuleMetadata,
  Type,
} from "@nestjs/common";
import { MeiliClient } from "./client";
import { MeiliUtils } from "./utils";
import { getMeiliIndexToken } from "./inject-meili";
import { MEILI_INDEX } from "./watermarks";
import { MeiliSearch } from "meilisearch";

export interface MeiliModuleOptions {
  host: string;
  apiKey: string;
}

export interface MeiliModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  useFactory: (
    ...args: any[]
  ) => Promise<MeiliModuleOptions> | MeiliModuleOptions;
  inject?: any[];
}

@Global()
@Module({})
export class MeiliModule {
  static forRoot(options: MeiliModuleOptions): DynamicModule {
    const clientController = new MeiliClient(options.host, options.apiKey);

    const clientControllerProvider: Provider = {
      provide: MeiliClient,
      useValue: clientController,
    };

    const clientProvider: Provider = {
      provide: MeiliSearch,
      useValue: clientController.client,
    };

    return {
      module: MeiliModule,
      imports: [],
      providers: [clientControllerProvider, clientProvider],
      exports: [MeiliClient, clientProvider],
    };
  }

  static forRootAsync(options: MeiliModuleAsyncOptions): DynamicModule {
    const clientControllerProvider: Provider = {
      provide: MeiliClient,
      useFactory: async (...args: any[]) => {
        const config = await options.useFactory(...args);
        return new MeiliClient(config.host, config.apiKey);
      },
      inject: options.inject || [],
    };

    const clientProvider: Provider = {
      provide: MeiliSearch,
      useFactory: async (...args: any[]) => {
        const config = await options.useFactory(...args);
        return new MeiliSearch({ host: config.host, apiKey: config.apiKey });
      },
      inject: options.inject || [],
    };

    return {
      module: MeiliModule,
      imports: options.imports || [],
      providers: [clientControllerProvider, clientProvider],
      exports: [MeiliClient, clientProvider],
    };
  }

  private static getIndexName(target: Type): string {
    const name = Reflect.getMetadata(MEILI_INDEX, target);
    if (!name) {
      throw new Error(
        `MeiliIndex name is not defined for class ${target.name}. Use @MeiliIndex('name')`
      );
    }
    return name;
  }

  static forFeature(models: Type[]): DynamicModule {
    const indexProviders: Provider[] = models.map((model) => {
      const indexName = this.getIndexName(model);
      return {
        provide: getMeiliIndexToken(indexName),
        useFactory: (client: MeiliClient) => client.initIndex(indexName),
        inject: [MeiliClient],
      };
    });

    const setupProvider: Provider = {
      provide: "MEILI_INDEX_SETUP",
      useFactory: async (utils: MeiliUtils, meiliClient: MeiliClient) => {
        for (const model of models) {
          await utils.setupIndex(model, meiliClient);
        }
      },
      inject: [MeiliUtils, MeiliClient],
    };

    return {
      module: MeiliModule,
      providers: [...indexProviders, setupProvider, MeiliUtils],
      exports: indexProviders,
    };
  }
}
