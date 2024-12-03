import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

let requestCount = 0;
let lastUp = Date.now();

@Injectable()
export class AppService {
  handleReq(index: number) {
    const now = Date.now();

    if (now - lastUp >= 1000) {
      requestCount = 0;
      lastUp = now;
    }

    requestCount++;
    
    if (requestCount >= 50) {
      throw new HttpException(
        'Too Many Requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const delay = Math.floor(Math.random() * 1000) + 1;
    return new Promise((res) =>
      setTimeout(() => {
        res({ index });
      }, delay),
    );
  }
}
