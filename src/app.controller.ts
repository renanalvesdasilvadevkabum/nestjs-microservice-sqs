import { Controller, Get } from '@nestjs/common';
import { Ctx, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { SqsContext } from './sqs-transporter/sqs.context';
import * as AWS from 'aws-sdk';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('criar')
  criar(@Payload() data: any, @Ctx() context: SqsContext) {
    console.log(`Message Received: ${data}. Mensagem Criada`);
    context.deleteMessage();
  }

  @MessagePattern('editar')
  editar(@Payload() data: any, @Ctx() context: SqsContext) {
    console.log(`Message Received: ${data}. Mensagem editada`);
    context.deleteMessage();
  }

  @MessagePattern('excluir')
  excluir(@Payload() data: any, @Ctx() context: SqsContext) {
    console.log(`Message Received: ${data}. Mensagem Excluida`);
    context.deleteMessage();
  }
}
