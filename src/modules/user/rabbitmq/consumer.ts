import { Channel, ConsumeMessage } from "amqplib";

export default class Consumer {
  constructor(
    private channel: Channel,
    private replyQueueName: string
    ) {}

  async consumeMessages (){
    console.log("ready to recieve messages");
    
    this.channel.consume(this.replyQueueName,(message : ConsumeMessage | null)=>{
      if(message){
      console.log("the reply is ...",JSON.parse(message.content.toString()))
      }
    })
  }
}