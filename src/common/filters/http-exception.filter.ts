import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response: Response = context.getResponse();
    const request: Request = context.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const msg =
      exception instanceof HttpException ? exception.getResponse() : exception;
    // const error = 'name' in msg ? msg.name : msg;
    const error = msg
    const method = request.method;
    const path = request.url;

    // TODO: save logger in db
    console.log("ERROR:", error)
    this.logger.error(
      `Status: ${status} Error: ${JSON.stringify(error)} path: ${path}`,
    );

    response.status(status).json({
      time: new Date().toISOString(),
      path,
      error,
    });
  }
}
