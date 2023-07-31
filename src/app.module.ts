import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EncryptionService } from './encryption.service';
import { EncryptionController } from './encryption.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, EncryptionController],
  providers: [AppService, EncryptionService],
})
export class AppModule {}
