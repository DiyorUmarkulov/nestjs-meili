import { Module, DynamicModule } from "@nestjs/common";
import { MeiliClient } from "../client";
import { MeiliUtils } from "../utils";
import { Reflector } from "@nestjs/core";

const utils = new MeiliUtils(new Reflector());

@Module({})
export class MeiliModule {
  static forRoot(options: { host: string; apiKey: string }): DynamicModule {
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

  static async forFeature(models: Function[]): Promise<DynamicModule> {
    const indexSetupPromises = models.map((index) => utils.setupIndex(index));

    await Promise.all(indexSetupPromises);

    return {
      module: MeiliModule,
      imports: [],
    };
  }
}
