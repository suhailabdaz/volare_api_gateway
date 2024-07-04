import { Channel, Connection, connect } from "amqplib"
import rabbitmqConfig from "../../../config/rabbitmq.config";
import Consumer from "./consumer";
import Producer from "./producer";


export default class RabbitMQClient{

  private producer : Producer | undefined;
  private consumer : Consumer | undefined;
  private connection : Connection | undefined ; 
  private producerChannel :  Channel | undefined;
  private consumerChannel : Channel | undefined ;

  async initialize (){
    try{
      this.connection = await connect(rabbitmqConfig.rabbitMQ.url) ;
      this.producerChannel = await this.connection.createChannel() ;
      this.consumerChannel =  await this.connection.createChannel() ;
      const {queue: replyQueueName} = await this.consumerChannel.assertQueue("", {exclusive: true})
      
      this.consumer = new Consumer(this.consumerChannel,replyQueueName)
      this.producer = new Producer(this.producerChannel,replyQueueName)
      this.consumer.consumeMessages()


    }catch (e : any){
      console.log("rabbimq error",e);
      
    }
  }

  async produce(data : any){
    console.log("middle",data);
    if(this.producer){
    return await this.producer.produceMessages(data)
    }
    else{
      console.log("no producer found");
      
    }
  }

}