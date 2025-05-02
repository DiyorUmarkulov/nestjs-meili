# 🚀 nestjs-meili

> **Schema-first** Meilisearch integration for [NestJS](https://nestjs.com/) using declarative decorators
> 🔧 Inspired by `@nestjs/mongoose`, optimized for full **TypeScript support** and developer experience

---

## 🔥 Features

- ✅ `@MeiliIndex()` — define Meilisearch indexes declaratively
- ✅ Attribute decorators: `@Searchable()`, `@Filterable()`, `@Sortable()`, and more
- ✅ Automatic index settings sync on application startup
- ✅ Fully typed models and index configuration
- ✅ Seamless integration with NestJS Dependency Injection
- ✅ Lightweight, modular, and framework-native

---

## 📦 Installation

```bash
npm install nestjs-meili
# or
yarn add nestjs-meili
```

---

## ⚙️ Quick Start

### 1. Import the Module

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
import {
  MeiliIndex,
  Searchable,
  Filterable,
  Sortable,
  Displayed,
  Distinct,
} from "nestjs-meili";

@MeiliIndex("movies")
export class Movie {
  @Searchable()
  @Displayed()
  title: string;

  @Searchable()
  @Displayed()
  description: string;

  @Filterable()
  @Displayed()
  genre: string;

  @Sortable()
  @Displayed()
  releaseDate: Date;

  @Distinct()
  @Displayed()
  id: string;
}
```

---

### 3. Sync Index Settings

```ts
// main.ts
import { setupIndex } from "nestjs-meili";
import { Movie } from "./movie.index";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Sync index settings on startup
  await setupIndex(Movie);

  await app.listen(3000);
}
bootstrap();
```

---

## 💡 Injecting Index into Services

```ts
import { Injectable } from "@nestjs/common";
import { InjectMeiliIndex } from "nestjs-meili";
import { MeiliSearchIndex } from "meilisearch";
import { Movie } from "./movie.index";

@Injectable()
export class MovieService {
  constructor(
    @InjectMeiliIndex(Movie)
    private readonly movieIndex: MeiliSearchIndex<Movie>
  ) {}

  async search(term: string) {
    return this.movieIndex.search(term);
  }
}
```

---

## 🧰 Utilities

- `setupIndex(modelClass)` — Applies index settings based on decorators
- `getMeiliIndexMetadata(modelClass)` — Extracts index metadata and configuration
- `InjectMeiliIndex(modelClass)` — Injects the Meilisearch index instance

---

## 🛣 Roadmap

- [ ] CLI: sync multiple indexes at once
- [ ] Watch mode: auto-sync on code changes (dev only)
- [ ] ORM hooks: optional integration with TypeORM, Prisma, Mongoose
- [ ] Decorators: `@Displayed()`, `@RankingRule()`, `@Distinct()`, `@StopWords()`, `@Synonyms()`

---

## 🤝 Contributing

We welcome contributions — bug reports, feature ideas, or pull requests.
Let’s make Meilisearch integration with NestJS effortless and powerful.

---

## 📄 License

MIT

---

> Made with ❤️ by [Diyor Umarkulov](https://github.com/diyorbek)
