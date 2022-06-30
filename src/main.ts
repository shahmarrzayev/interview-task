import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EConfig } from './common/config.enum';
import { getConfig } from './common/util';
import helmet from 'helmet';
// import { TransformInterceptor } from './module/auth/interceptors/transform.interceptor';
// import { HttpExceptionFilter } from './module/auth/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalInterceptors(new TransformInterceptor());
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  app.use(helmet());

  await app.listen(3001 || getConfig(EConfig.PORT), () => {});
}
bootstrap();
