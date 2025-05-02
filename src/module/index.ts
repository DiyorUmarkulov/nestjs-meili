import { Module, Global } from "@nestjs/common";
import { MeiliModule } from "./moduleFactory";

@Global()
@Module({
  imports: [MeiliModule],
  exports: [MeiliModule],
})
export class MeiliSearchModule {}
