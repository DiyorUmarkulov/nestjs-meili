import {
  Module,
  DynamicModule,
  Provider,
  Global,
  ModuleMetadata,
} from "@nestjs/common";
import { MeiliClient } from "./client";
import { MeiliUtils } from "./utils";
import { Reflector } from "@nestjs/core";

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

  static forRootAsync<T extends Function>(
    options: MeiliModuleAsyncOptions
  ): DynamicModule {
    const clientProvider: Provider = {
      provide: MeiliClient,
      useFactory: async (...args: T[]) => {
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

  static async forFeature(models: Function[]): Promise<DynamicModule> {
    const utils = new MeiliUtils(new Reflector());
    await Promise.all(models.map((model) => utils.setupIndex(model)));

    return {
      module: MeiliModule,
      imports: [],
    };
  }
}
