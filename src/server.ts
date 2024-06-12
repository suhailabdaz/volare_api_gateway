import App from "./app"
import "dotenv/config"

const port = Number(process.env.APIgateway_port)
new App().startServer(port)