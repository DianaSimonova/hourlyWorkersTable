import { Module } from '@nestjs/common';
import { AppController } from './app.controller'; 
import { MulterModule } from '@nestjs/platform-express';
import { AppService } from './app.service'; 

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Define the destination folder for uploaded files
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
