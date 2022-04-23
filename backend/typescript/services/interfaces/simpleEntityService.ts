export interface SimpleEntityRequestDTO {
  stringField: string;
  intField: number;
  enumField: string;
  stringArrayField: string[];
  boolField: boolean;
}

export interface SimpleEntityResponseDTO {
  id: string;
  stringField: string;
  intField: number;
  enumField: string;
  stringArrayField: string[];
  boolField: boolean;
}

export interface ISimpleEntityService {
  /**
   * retrieve the SimpleEntity with the given id
   * @param id SimpleEntity id
   * @returns requested SimpleEntity
   * @throws Error if retrieval fails
   */
  getEntity(id: string): Promise<SimpleEntityResponseDTO>;

  /**
   * retrieve all SimpleEntities
   * @param
   * @returns returns array of SimpleEntities
   * @throws Error if retrieval fails
   */
  getEntities(): Promise<SimpleEntityResponseDTO[]>;

  /**
   * create a SimpleEntity with the fields given in the DTO, return created SimpleEntity
   * @param entity new SimpleEntity
   * @returns the created SimpleEntity
   * @throws Error if creation fails
   */
  createEntity(
    entity: SimpleEntityRequestDTO,
  ): Promise<SimpleEntityResponseDTO>;

  /**
   * update the SimpleEntity with the given id with fields in the DTO, return updated SimpleEntity
   * @param id SimpleEntity id
   * @param entity Updated SimpleEntity
   * @returns the updated SimpleEntity
   * @throws Error if update fails
   */
  updateEntity(
    id: string,
    entity: SimpleEntityRequestDTO,
  ): Promise<SimpleEntityResponseDTO | null>;

  /**
   * delete the SimpleEntity with the given id
   * @param id SimpleEntity id
   * @returns id of the SimpleEntity deleted
   * @throws Error if deletion fails
   */
  deleteEntity(id: string): Promise<string>;
}
