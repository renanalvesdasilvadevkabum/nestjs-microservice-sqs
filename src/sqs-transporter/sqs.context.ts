import { BaseRpcContext } from '@nestjs/microservices/ctx-host/base-rpc.context';
import * as Aws from 'aws-sdk';

type SqsContextArgs = [Record<string, any>, any, string, string];

export class SqsContext extends BaseRpcContext<SqsContextArgs> {
  constructor(args: SqsContextArgs) {
    super(args);
  }

  getMessage() {
    return this.args[0];
  }

  getSqsRef() {
    return this.args[1];
  }

  getPattern() {
    return this.args[2];
  }

  getQueueUrl() {
    return this.args[3];
  }

  deleteMessage() {
    const sqs: Aws.SQS = this.getSqsRef();
    const QueueUrl = this.getQueueUrl();
    const message = this.getMessage();
    const ReceiptHandle = message.ReceiptHandle;

    sqs.deleteMessage(
      {
        QueueUrl,
        ReceiptHandle,
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      (err, data) => {
        if (err) {
          throw Error(
            `Error in delete message.\n 
             ReceiptHandle: ${ReceiptHandle} \n
             Message: ${err}`,
          );
        }
      },
    );
  }
}
