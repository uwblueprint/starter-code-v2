import { storage } from "firebase-admin";
import IFileStorageService from "../interfaces/storageService";

class FileStorageService implements IFileStorageService {
  bucket: any;

  constructor() {
    this.bucket = storage();
  }

  async getFile(fileName: string): Promise<File | null> {
    try {
      this.bucket
        .child(fileName)
        .getDownloadURL()
        .then((url: string) => {
          // eslint-disable-next-line no-console
          console.log(url);

          // // Or inserted into an <img> element
          // var img = document.getElementById("myimg");
          // img.setAttribute("src", url);
        })
        .catch((error: any) => {
          // Handle any errors
          // eslint-disable-next-line no-console
          console.log(error);
        });
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
