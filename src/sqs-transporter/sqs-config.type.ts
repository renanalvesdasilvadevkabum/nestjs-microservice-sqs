export type SqsConfig = {
  queueUrl: string;
  maxNumberMessages: number;
  pollingTime: number;
  region: string;
  key?: string;
  secret?: string;
};
