import { storage } from "firebase-admin";

import IFileStorageService from "../interfaces/storageService";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

class FileStorageService implements IFileStorageService {
  bucket: any;

  constructor(bucketName: string) {
    this.bucket = storage().bucket(bucketName);
  }

  async getFile(
    fileName: string,
    expirationTimeMinutes: number = 60,
  ): Promise<string> {
    const expirationDate = new Date();
    expirationDate.setMinutes(
      expirationDate.getMinutes() + expirationTimeMinutes,
    );
    try {
      const res = await this.bucket.file(fileName).getSignedUrl({
        action: "read",
        expires: expirationDate,
      });
      return res[0];
    } catch (error) {
      Logger.error(`Failed to retrieve file. Reason = ${error.message}`);
      throw error;
    }
  }

  async createFile(
    fileName: string,
    filePath: string,
    contentType: string | null = null,
  ): Promise<void> {
    try {
      const currentBlob = await this.bucket.file(fileName);
      if ((await currentBlob.exists())[0]) {
        throw new Error(`File name ${fileName} already exists`);
      }
      await this.bucket.upload(filePath, {
        destination: fileName,
        metadata: { contentType },
      });
    } catch (error) {
      Logger.error(`Failed to upload file. Reason = ${error.message}`);
      throw error;
    }
  }

  async updateFile(
    fileName: string,
    filePath: string,
    contentType: string | null = null,
  ): Promise<void> {
    try {
      const currentBlob = await this.bucket.file(fileName);
      if (!(await currentBlob.exists())[0]) {
        throw new Error(`File name ${fileName} does not exist`);
      }
      await this.bucket.upload(filePath, {
        destination: fileName,
        metadata: { contentType },
      });
    } catch (error) {
      Logger.error(`Failed to update file. Reason = ${error.message}`);
      throw error;
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      const currentBlob = await this.bucket.file(fileName);
      if (!currentBlob) {
        throw new Error(`File name ${fileName} does not exist`);
      }
      await currentBlob.delete();
    } catch (error) {
      Logger.error(`Failed to delete file. Reason = ${error.message}`);
      throw error;
    }
  }
}

export default FileStorageService;
