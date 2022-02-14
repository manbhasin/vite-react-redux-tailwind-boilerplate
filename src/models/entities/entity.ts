export interface Entity {
  id: number;
}

export interface EntityMap<T extends Entity> {
  [key: number]: T;
}
