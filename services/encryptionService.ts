import CryptoJS from 'crypto-js';

export class EncryptionService {
  static async generateKey(walletAddress: string, signature: string): Promise<string> {
    // Use wallet signature as encryption key base
    const key = CryptoJS.SHA256(walletAddress + signature).toString();
    return key;
  }

  static encrypt(data: any, key: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        key
      ).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Encryption failed');
    }
  }

  static decrypt(encryptedData: string, key: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, key);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (!decrypted) {
          throw new Error("Decryption resulted in an empty string. This could be due to a wrong key.");
      }
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Decryption failed. Check if the key is correct.');
    }
  }
}