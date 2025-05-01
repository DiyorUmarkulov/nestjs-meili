import { SetMetadata } from "@nestjs/common";

export const MeiliIndex = (index: string) => SetMetadata("meiliIndex", index);

export const Searchable = () => SetMetadata("searchable", true);

export const Filterable = () => SetMetadata("filterable", true);

export const Sortable = () => SetMetadata("sortable", true);
