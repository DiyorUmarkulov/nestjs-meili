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
import { Reflector } from "@nestjs/core";
import { getMeiliIndexToken } from "./inject-meili";
import { MEILI_INDEX_WATERMARK } from "./watermarks";

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
    return {
      module: MeiliModule,
      providers: [
        {
          provide: MeiliClient,
          useValue: new MeiliClient(options.host, options.apiKey),
        },
      ],
      exports: [MeiliClient],
    };
  }

  static forRootAsync(options: MeiliModuleAsyncOptions): DynamicModule {
    const clientProvider: Provider = {
      provide: MeiliClient,
      useFactory: async (...args: any[]) => {
        const config = await options.useFactory(...args);
        return new MeiliClient(config.host, config.apiKey);
      },
      inject: options.inject || [],
    };

    return {
      module: MeiliModule,
      imports: options.imports || [],
      providers: [clientProvider],
      exports: [MeiliClient],
    };
  }

  private static getIndexName(target: Function): string {
    const name = Reflect.getMetadata(MEILI_INDEX_WATERMARK, target);
    if (!name) {
      throw new Error(
        `MeiliIndex name is not defined for class ${target.name}. Use @MeiliIndex('name')`
      );
    }
    return name;
  }

  static async forFeature(models: Function[]): Promise<DynamicModule> {
    const reflector = new Reflector();
    const utils = new MeiliUtils(reflector);

    const indexProviders: Provider[] = await Promise.all(
      models.map(async (model) => {
        const index = await utils.setupIndex(model);
        const indexName = this.getIndexName(model);
        return {
          provide: getMeiliIndexToken(indexName),
          useValue: index,
        };
      })
    );

    return {
      module: MeiliModule,
      providers: indexProviders,
      exports: indexProviders,
    };
  }
}
