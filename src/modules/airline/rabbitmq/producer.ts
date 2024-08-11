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
      rabbitmqConfig.rabbitMQ.queues.airlineQueue,
      Buffer.from(JSON.stringify(data)),
      {
        replyTo: this.replyQueueName,
        correlationId: uuid,
        expiration: 10,
        headers: {
          function: operation ,
        } ,
      }
    );
 
    return new Promise((res, rej) => {
      this.eventEmitter.once(uuid, async (data) => {
          try {
              const reply = JSON.parse(data.content.toString());
              console.log("promise reply", reply);
              // No need to convert reply back to a Buffer and then to a string
              // Just use reply as is
              res(reply);
          } catch (error) {
              rej(error);
          }
      });
  });
  }
}
