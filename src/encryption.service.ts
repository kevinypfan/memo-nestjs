import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class EncryptionService {
  async encrypt(data: string, password: string) {
    const iv = randomBytes(16);

    // The key length is dependent on the algorithm.
    // In this case for aes256, it is 32 bytes.
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);

    return {
      data: encryptedData.toString('base64url'),
      iv: iv.toString('hex'),
    };
  }

  async decrypt(encryptedData: string, password: string, iv: string) {
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv(
      'aes-256-ctr',
      key,
      Buffer.from(iv, 'hex'),
    );
    const decryptedText = Buffer.concat([
      decipher.update(Buffer.from(encryptedData, 'base64url')),
      decipher.final(),
    ]);

    return { data: decryptedText.toString() };
  }
}
