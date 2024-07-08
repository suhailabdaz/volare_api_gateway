import { Channel } from "amqplib";
import rabbitmqConfig from "../../../config/rabbitmq.config";
import { randomUUID } from "crypto";
import EventEmitter from "events";

export default class Producer {
  constructor(
    private channel: Channel,
    private replyQueueName: string,
    private eventEmitter: EventEmitter
  ) {}

  async produceMessages(data: any, operation: string) {
    const uuid = randomUUID();
    this.channel.sendToQueue(
      rabbitmqConfig.rabbitMQ.queues.userQueue,
      Buffer.from(JSON.stringify(data)),
      {
        replyTo: this.replyQueueName,
        correlationId: uuid,
        expiration: 10,
        headers: {
          function: operation,
        },
      }
    );
 
    return new Promise((res, rej) => {
        this.eventEmitter.once(uuid, async (data) => {
            const reply = JSON.parse(data.content.toString())
            console.log("promise reply",reply);
            const jsonString = Buffer.from(reply.data).toString('utf-8');
            console.log("promise reply 2",jsonString);
            const replyObject = jsonString;
            console.log("promise reply 3",replyObject);
            res(replyObject);
        })
    })
  }
}
