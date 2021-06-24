interface IFileStorageService {
  /**
   * Retrieves file
   * @param fileName name of file
   * @returns response
   * @throws Error if file is not retrieved
   */
  getFile(fileName: string): Promise<string>;

  /**
   * Retrieves file
   * @param fileName name of file
   * @throws Error if name of file already exists
   * @throws Error if file is not retrieved
   */
  createFile(fileName: string, filePath: string): Promise<void>;
  //   updateFile(fileName: string, file: File): Promise<void>;
  //   deleteFile(fileName: string): Promise<void>;
}

export default IFileStorageService;
