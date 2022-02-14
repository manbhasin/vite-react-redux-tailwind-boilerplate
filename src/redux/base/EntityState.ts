import { Entity } from 'models/entities/entity';

export interface EntityState<T extends Entity = Entity> {
  entities: { [id: number]: T };
  currentId?: number;
}
