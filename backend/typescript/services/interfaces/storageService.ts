interface IFileStorageService {
  getFile(fileName: string): Promise<string | null>;
  createFile(
    fileName: string,
    filePath: string,
    file: File,
  ): Promise<string | null>;
  //   updateFile(fileName: string, file: File): Promise<void>;
  //   deleteFile(fileName: string): Promise<void>;
}

export default IFileStorageService;
