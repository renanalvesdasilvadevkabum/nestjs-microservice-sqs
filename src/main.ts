import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { SqsTransporter } from './sqs-transporter/sqs.transporter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      strategy: new SqsTransporter({
        maxNumberMessages: 10,
        pollingTime: 1000,
        queueUrl: '',
        region: 'us-east-1',
        key: '',
        secret: '',
      }),
    },
  );
  await app.listen();
}
bootstrap();
