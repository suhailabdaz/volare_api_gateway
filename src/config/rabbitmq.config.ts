import 'dotenv/config'

export default {
    rabbitMQ: {
      url: String(process.env.RabbitMQ_Link),
      queues: {
        userQueue: "user_queue",
        adminQueue: "admin_queue",
        authQueue: "auth_queue",
        authorityQueue: "authority_queue",
        airlineQueue:'airline_queue'
      },
    },
  };