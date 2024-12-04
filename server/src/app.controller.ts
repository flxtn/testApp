import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AppService } from './app.service';



@Controller()
export class AppController {
  private logger = new Logger(AppController.name);
  private lastUp = Date.now();
  private requestCount = 0;
  constructor(private readonly appService: AppService) {}

  @Post('api')
  async handleRequest(@Body() body: { index: number }) {
    const index = body.index;
    const now = Date.now();

    if (now - this.lastUp >= 1000) {
      this.requestCount = 0;
      this.lastUp = now;
    }

    this.logger.log(`Received request with index: ${index}`);

    this.requestCount++;

    if (this.requestCount >= 50) {
      throw new HttpException(
        'Too Many Requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    const delay = Math.floor(Math.random() * 1000) + 1;

    return new Promise((resolve) => {
      setTimeout(() => {
        this.logger.log(
          `Processed request with index: ${index} after ${delay}ms`,
        );
        resolve({ index });
      }, delay);
    });
  }
}
