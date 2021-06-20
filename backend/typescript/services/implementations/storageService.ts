import { storage } from "firebase-admin";
import { Bucket } from "@google-cloud/storage";
import IFileStorageService from "../interfaces/storageService";

class FileStorageService implements IFileStorageService {
  bucket: Bucket;

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
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
    return null;
  }

  //   async createFile(fileName: string, file: File): Promise<void> {}

  //   async updateFile(fileName: string, file: File): Promise<void> {}

  //   async deleteFile(fileName: string): Promise<void> {}
}

export default FileStorageService;
