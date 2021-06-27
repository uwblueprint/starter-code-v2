import { storage } from "firebase-admin";
import IFileStorageService from "../interfaces/storageService";
import logger from "../../utilities/logger";

const Logger = logger(__filename);
class FileStorageService implements IFileStorageService {
  bucket: any;

  private expirationTimeMinutes = 60;

  constructor() {
    this.bucket = storage().bucket(
      "gs://uw-blueprint-starter-code.appspot.com",
    );
  }

  async getFile(fileName: string): Promise<string> {
    try {
      const res = await this.bucket.file(fileName).getSignedUrl({
        action: "read",
        expires: Date.now() + this.expirationTimeMinutes * 1000,
      });
      return res[0];
    } catch (error) {
      Logger.error(`Failed to get entity. Reason = ${error.message}`);
      throw error;
    }
  }

  async createFile(fileName: string, filePath: string): Promise<void> {
    try {
      const currentBlob = await this.bucket.file(fileName);
      if ((await currentBlob.exists())[0]) {
        throw new Error(`File name ${fileName} already exists`);
      }
      await this.bucket.upload(filePath, {
        destination: fileName,
      });
    } catch (error) {
      Logger.error(`Failed to upload file. Reason = ${error.message}`);
      throw error;
    }
  }

  //   async updateFile(fileName: string, file: File): Promise<void> {}

  //   async deleteFile(fileName: string): Promise<void> {}
}

export default FileStorageService;
