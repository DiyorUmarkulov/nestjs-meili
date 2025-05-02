# 🔍 nestjs-meili

Seamless and declarative integration of [MeiliSearch](https://www.meilisearch.com/) into [NestJS](https://nestjs.com/).
Use decorators to configure indexes and inject `MeiliSearch` with type safety and zero boilerplate.

---

## ✨ Features

- 🧠 **Decorator-driven** index configuration
- ⚡ **Modular** design with `forFeature()` per entity
- 🧩 **Typed injection** of indexes using class reference
- 🔧 **Sync and async** initialization (e.g. with `ConfigModule`)
- 🧪 Built-in **testing** support
- 🚫 No global registry — each module owns its own setup

---

## 📦 Installation

```bash
yarn add nestjs-meili meilisearch reflect-metadata
```

Update `tsconfig.json`:

```json
{
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true
}
```

---

## 🚀 Quick Start

### 1. Define a model

```ts
@MeiliIndex("books")
@RankingRules(["words", "typo"])
@StopWords(["the", "a"])
@Synonyms({ hp: ["harry potter"] })
@Pagination(1000)
@Faceting(50)
export class Book {
  @PrimaryKey()
  id: string;

  @Searchable()
  title: string;

  @Filterable()
  genre: string;

  @Sortable()
  publishedAt: string;

  @Displayed()
  title: string;

  @Displayed()
  genre: string;

  @Distinct()
  isbn: string;
}
```

### 2. Register module

```ts
@Module({
  imports: [
    MeiliModule.forRoot({
      host: "http://localhost:7700",
      apiKey: "your_meili_api_key",
    }),
    MeiliModule.forFeature([Book]),
  ],
})
export class AppModule {}
```

---

## 🧰 Inject and use

```ts
@Injectable()
export class BookService {
  constructor(
    @InjectMeiliIndex(Book) private readonly bookIndex: Index<Book>
  ) {}

  searchBooks(q: string) {
    return this.bookIndex.search(q);
  }
}
```

---

## ⚙️ Async Configuration

```ts
@Module({
  imports: [
    ConfigModule.forRoot(),
    MeiliModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        host: config.get("MEILI_HOST"),
        apiKey: config.get("MEILI_API_KEY"),
      }),
      inject: [ConfigService],
    }),
    MeiliModule.forFeature([Book]),
  ],
})
export class AppModule {}
```

---

## 🧠 Available Decorators

| Decorator              | Target   | Purpose                             |
| ---------------------- | -------- | ----------------------------------- |
| `@MeiliIndex(name)`    | Class    | Define MeiliSearch index name       |
| `@PrimaryKey()`        | Property | Set primary key field               |
| `@Searchable()`        | Property | Field is full-text searchable       |
| `@Filterable()`        | Property | Field is usable in filters          |
| `@Sortable()`          | Property | Field is sortable                   |
| `@Displayed()`         | Property | Field is returned in search results |
| `@Distinct()`          | Property | Used for deduplication              |
| `@RankingRules([...])` | Class    | Custom ranking rules                |
| `@StopWords([...])`    | Class    | Stop words for the index            |
| `@Synonyms({...})`     | Class    | Synonyms map                        |
| `@Pagination(n)`       | Class    | Sets `maxTotalHits`                 |
| `@Faceting(n)`         | Class    | Sets `maxValuesPerFacet`            |

---

## 🧪 Testing

Replace `MeiliService` with a mock in unit tests:

```ts
{
  provide: MeiliService,
  useValue: {
    getIndex: jest.fn().mockReturnValue(mockIndex),
  },
}
```

You can also inject and mock the index directly using `@InjectMeiliIndex(YourModel)`.

---

## 🧭 Architecture

- `MeiliModule.forRoot(...)` initializes the Meili client once
- `MeiliModule.forFeature([ModelA, ModelB])`:

  - Registers each index based on decorators
  - Applies index settings at startup
  - Exposes injectable typed index via `@InjectMeiliIndex(Model)`

No need for external config, global registries, or reflection hacks.

---

## ❓ Why use `nestjs-meili`?

| Feature                     | Manual Setup | `nestjs-meili` |
| --------------------------- | ------------ | -------------- |
| Type-safe index injection   | ❌           | ✅             |
| Centralized index config    | ❌           | ✅             |
| Decorator-based schema      | ❌           | ✅             |
| Built-in support for NestJS | ❌           | ✅             |
| No global registry required | ❌           | ✅             |

---

## 🚧 Roadmap

- [ ] Auto-sync schema changes (diff vs Meili state)
- [ ] CLI to print index status & debug settings
- [ ] Hooks: `@OnIndexSynced()`, `@OnIndexError()`
- [ ] Optional `@Boost()` decorator
- [ ] Automatic deletion/reindex hooks

---

## 📜 License

MIT © 2025
