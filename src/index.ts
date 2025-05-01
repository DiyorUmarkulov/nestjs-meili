import { Module, Global } from "@nestjs/common";
import { MeiliModule } from "./module";

@Global()
@Module({
  imports: [MeiliModule],
  exports: [MeiliModule],
})
export class MeiliSearchModule {}
