interface IFileStorageService {
  /**
   * Retrieves file
   * @param fileName name of file
   * @returns response
   * @throws Error if file is not retrieved
   */
  getFile(fileName: string): Promise<string>;

  /**
   * Creates file
   * @param fileName name of file
   * @param filePath path of file
   * @throws Error if name of file already exists
   * @throws Error if file is not uploaded
   */
  createFile(fileName: string, filePath: string): Promise<void>;

  /**
   * Updates file
   * @param fileName name of file
   * @param filePath path to file
   * @throws Error if name of file does not exist
   * @throws Error if file is not retrieved
   */
  updateFile(fileName: string, filePath: string): Promise<void>;

  /**
   * Deletes file
   * @param fileName name of file
   * @throws Error if name of file does not exist
   * @throws Error if file is not retrieved
   */
  deleteFile(fileName: string): Promise<void>;
}

export default IFileStorageService;
