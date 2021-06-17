interface IFileStorageService {
  getFile(fileName: string): Promise<File | null>;
  //   createFile(fileName: string, file: File): Promise<void>;
  //   updateFile(fileName: string, file: File): Promise<void>;
  //   deleteFile(fileName: string): Promise<void>;
}

export default IFileStorageService;
