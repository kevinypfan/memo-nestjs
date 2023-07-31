import { Body, Controller, Post } from '@nestjs/common';
import { EncryptionService } from './encryption.service';

// @Auth(AuthType.Bearer, AuthType.FugleCookie)
@Controller({ path: 'auth', version: '1.0' })
export class EncryptionController {
  constructor(private readonly encryptionService: EncryptionService) {}

  @Post('/encrypt/text')
  async encryptText(@Body() body: { data: string }) {
    return this.encryptionService.encrypt(body.data, process.env.AES_PASSWORD);
  }

  @Post('/decrypt/text')
  async decryptText(@Body() body: { data: string; iv: string }) {
    return this.encryptionService.decrypt(
      body.data,
      process.env.AES_PASSWORD,
      body.iv,
    );
  }
}
