import { Channel } from "amqplib";
import rabbitmqConfig from "../../../config/rabbitmq.config";
import {randomUUID} from "crypto"

export default class Producer {
  constructor(
    private channel: Channel,
    private replyQueueName: string,
  ) {}


  async produceMessages (data : any){
    const uuid =  randomUUID()
    console.log("corr.id is ",uuid);
      this.channel.sendToQueue(rabbitmqConfig.rabbitMQ.queues.userQueue,
        Buffer.from(JSON.stringify(data)),{
          replyTo: this.replyQueueName,
          correlationId : uuid
        }
      )
  }
}