import { produce } from 'immer';
import { Entity } from 'models/entities/entity';
import { EntityState } from './EntityState';

export const getIds = (entities: Entity[]) => entities.map((e) => e.id);

export const addOne = (state: EntityState, entity: Entity) =>
  produce(state, (draft: EntityState) => {
    draft.entities[entity.id] = entity;
  });

export const addMany = (state: EntityState, entities: Entity[]) => {
  if (entities.length === 0) return state;

  return produce(state, (draft: EntityState) => {
    (entities || []).forEach((entity: Entity) => {
      draft.entities[entity.id] = entity;
    });
  });
};
