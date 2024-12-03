import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AppService } from './app.service';

let requestCount = 0;
let lastUp = Date.now();

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Post('api')
  async handleRequest(@Body() body: { index: number }) {
    const index = body.index;
    const now = Date.now();

    if (now - lastUp >= 1000) {
      requestCount = 0;
      lastUp = now;
    }

    this.logger.log(`Received request with index: ${index}`);

    requestCount++;

    if (requestCount >= 50) {
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
