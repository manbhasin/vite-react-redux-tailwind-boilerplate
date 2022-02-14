import { Entity } from './entity';

export interface User extends Entity {
  first_name: string;
  last_name?: string;
  email: string;
}
