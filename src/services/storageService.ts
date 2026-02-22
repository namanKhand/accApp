import { storage } from './firebase';

class StorageService {
  /**
   * Uploads a file from a local URI to Firebase Storage
   * @param uri Local file URI from ImagePicker
   * @param path Storage path (e.g., 'checkins/userid/goalid/timestamp.jpg')
   * @returns Download URL of the uploaded file
   */
  async uploadFile(uri: string, path: string): Promise<string> {
    try {
      // Fetch the file from the local URI
      const response = await fetch(uri);
      const blob = await response.blob();

      // Create a reference to the storage path
      const ref = storage.ref().child(path);

      // Upload the blob
      await ref.put(blob);

      // Get and return the download URL
      const downloadURL = await ref.getDownloadURL();
      return downloadURL;
    } catch (e) {
      console.error('Error uploading file to Firebase Storage', e);
      throw e;
    }
  }

  /**
   * Deletes a file from Firebase Storage
   * @param path Storage path to the file
   */
  async deleteFile(path: string): Promise<void> {
    try {
      const ref = storage.ref().child(path);
      await ref.delete();
    } catch (e) {
      console.error('Error deleting file from Firebase Storage', e);
      throw e;
    }
  }
}

export const storageService = new StorageService();
