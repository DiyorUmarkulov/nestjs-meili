# 🚀 nestjs-meili

> ✨ Schema-first Meilisearch integration for [NestJS](https://nestjs.com/) using decorators.

> Inspired by `@nestjs/mongoose` — designed for full TypeScript support and ease of use.

---

## 🔥 Features

- ✅ `@MeiliIndex()` — define Meilisearch indexes declaratively

- ✅ `@Searchable()`, `@Filterable()`, `@Sortable()` — clean and expressive schema syntax

- ✅ Auto-syncs index settings on app startup

- ✅ Full TypeScript support (models, attributes, settings)

- ✅ Built-in DI-compatible access to Meilisearch indexes

- ✅ Lightweight and framework-native

---

## 📦 Installation

```bash

npm  install  nestjs-meili

# or

yarn  add  nestjs-meili

```

---

## ⚙️ Quick Start

### 1. Import the MeiliModule

```ts
// app.module.ts

import { Module } from "@nestjs/common";

import { MeiliModule } from "nestjs-meili";

@Module({
  imports: [
    MeiliModule.forRoot({
      host: "http://localhost:7700",

      apiKey: "masterKey", // optional
    }),
  ],
})
export class AppModule {}
```

---

### 2. Define an Index with Decorators

```ts
// movie.index.ts

import { MeiliIndex, Searchable, Filterable, Sortable } from "nestjs-meili";

@MeiliIndex("movies")
export class Movie {
  @Searchable()
  title: string;

  @Searchable()
  description: string;

  @Filterable()
  genre: string;

  @Sortable()
  releaseDate: Date;
}
```

---

### 3. Sync Index Settings (e.g. on bootstrap)

```ts
// main.ts

import { setupIndex } from "nestjs-meili";

import { Movie } from "./movie.index";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply index settings

  await setupIndex(Movie);

  await app.listen(3000);
}

bootstrap();
```

---

## 📥 Injecting Index in Services

```ts
import { InjectMeiliIndex, MeiliIndexToken } from "nestjs-meili";
import { MeiliSearchIndex } from "meilisearch";
import { Movie } from "./movie.index";

@Injectable()
export class MovieService {
  constructor(
    @InjectMeiliIndex(Movie)
    private readonly movieIndex: MeiliSearchIndex<Movie>
  ) {}

  async search(term: string) {
    return this.movieIndex.search<Movie>(term);
  }
}
```

---

## 🧰 Utilities

- `setupIndex(modelClass)` — Applies index settings based on decorators

- `getMeiliIndexMetadata(modelClass)` — Returns index name and attribute configuration

- `InjectMeiliIndex(modelClass)` — Injects the underlying Meilisearch index instance

---

## 📌 Roadmap

- [ ] CLI for syncing all indexes

- [ ] Watch mode for index changes in dev

- [ ] ORM hooks (optional integration with TypeORM/Prisma/Mongoose)

- [ ] More decorators: `@Displayed()`, `@RankingRule()`, `@Distinct()`

---

## 🧑‍💻 Contributing

Contributions are welcome! Open issues, suggest features, or submit PRs.

This package was built for productivity and DX — help us make it even better.

---

## 📄 License

MIT

---

> Made with ❤️ by Diyor Umarkulov
