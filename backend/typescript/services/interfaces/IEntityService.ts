export interface EntityRequestDTO {
  stringField: string;
  intField: number;
  enumField: string;
  stringArrayField: [string];
  boolField: boolean;
}

export interface EntityResponseDTO {
  id: string;
  stringField: string;
  intField: number;
  enumField: string;
  stringArrayField: [string];
  boolField: boolean;
}

export interface IEntityService {
  /**
   * retrieve the Entity with the given id
   * @param id entity id
   * @returns requested Entity
<<<<<<< HEAD
=======
   * @throws Error if retrieval fails
>>>>>>> origin/main
   */
  getEntity(id: string): Promise<EntityResponseDTO>;

  /**
   * retrieve all Entities
   * @param
   * @returns returns array of Entities
<<<<<<< HEAD
=======
   * @throws Error if retrieval fails
>>>>>>> origin/main
   */
  getEntities(): Promise<EntityResponseDTO[]>;

  /**
   * create an Entity with the fields given in the DTO, return created Entity
   * @param entity user's email
   * @returns the created Entity
<<<<<<< HEAD
=======
   * @throws Error if creation fails
>>>>>>> origin/main
   */
  createEntity(entity: EntityRequestDTO): Promise<EntityResponseDTO>;

  /**
   * update the Entity with the given id with fields in the DTO, return updated Entity
   * @param id entity id
   * @param entity Updated Entity
   * @returns the updated Entity
<<<<<<< HEAD
=======
   * @throws Error if update fails
>>>>>>> origin/main
   */
  updateEntity(
    id: string,
    entity: EntityRequestDTO,
  ): Promise<EntityResponseDTO | null>;

  /**
   * delete the entity with the given id
   * @param id entity id
<<<<<<< HEAD
   * @returns nothing
=======
   * @throws Error if deletion fails
>>>>>>> origin/main
   */
  deleteEntity(id: string): Promise<void>;
}
