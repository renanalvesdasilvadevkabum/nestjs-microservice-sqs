import {
  CustomTransportStrategy,
  Server,
  Transport,
} from '@nestjs/microservices';
import * as AWS from 'aws-sdk';
import { SqsConfig } from './sqs-config.type';
import { SqsContext } from './sqs.context';

export class SqsTransporter extends Server implements CustomTransportStrategy {
  private sqs: AWS.SQS;
  private queueUrl: string;
  private maxNumberMessages: number;
  private pollingTime: number;

  constructor(config: SqsConfig) {
    super();
    this.queueUrl = config.queueUrl;
    this.maxNumberMessages =
      config.maxNumberMessages > 10 ? 10 : config.maxNumberMessages;
    this.pollingTime = config.pollingTime;
    AWS.config.update({
      region: config.region,
      accessKeyId: config.key,
      secretAccessKey: config.secret,
    });
    this.sqs = new AWS.SQS();
  }

  transportId?: Transport;
  listen(callback: (...optionalParams: unknown[]) => any) {
    this.start();
    callback();
  }

  start() {
    setInterval(() => {
      this.receiveMessages(this.maxNumberMessages);
    }, this.pollingTime);
  }

  async receiveMessages(maxNumberMessages: number) {
    this.sqs.receiveMessage(
      {
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: maxNumberMessages,
      },
      (err, data) => {
        if (err) {
          console.log(`Error in receive message. Error Message: ${err}`);
          return;
        }
        if (data.Messages) {
          for (const message of data.Messages) {
            try {
              const payload = JSON.parse(message.Body);

              const pattern = payload.pattern;

              const context = new SqsContext([
                message,
                this.sqs,
                pattern,
                this.queueUrl,
              ]);

              this.handleEvent(
                pattern,
                {
                  data: payload.data,
                  pattern,
                },
                context,
              );
            } catch (error) {
              console.log(`Error in process message. Error: ${error}`);
            }
          }
        }
      },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  close() {
    console.log('close');
  }
}
