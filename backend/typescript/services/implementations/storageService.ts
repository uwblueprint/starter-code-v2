import { storage } from "firebase-admin";
import IFileStorageService from "../interfaces/storageService";
import logger from "../../utilities/logger";

const Logger = logger(__filename);
class FileStorageService implements IFileStorageService {
  bucket: any;

  private expirationTimeMinutes = 60;

  constructor() {
    // TODO: Store the bucket url somewhere else, maybe in a config
    this.bucket = storage().bucket(
      "gs://uw-blueprint-starter-code.appspot.com",
    );
  }

  async getFile(fileName: string): Promise<string | null> {
    try {
      const res = await this.bucket.file(fileName).getSignedUrl({
        action: "read",
        expires: Date.now() + this.expirationTimeMinutes * 1000,
      });
      // TODO: Is it guarenteed to return a list of one string always?
      return res[0];
    } catch (error) {
      Logger.error(`Failed to get entity. Reason = ${error.message}`);
    }
    return null;
  }

  async createFile(fileName: string, filePath: string): Promise<string | null> {
    const currentBlob = await this.getFile(fileName);
    if (currentBlob) {
      throw new Error(`File name ${fileName} already exists`);
    } else {
      try {
        const res = await this.bucket.upload(filePath, {
          destination: fileName,
        });
        return res[0];
      } catch (error) {
        Logger.error(`Failed to upload file. Reason = ${error.message}`);
        throw error;
      }
    }
    return null;
  }

  //   async updateFile(fileName: string, file: File): Promise<void> {}

  //   async deleteFile(fileName: string): Promise<void> {}
}

export default FileStorageService;
