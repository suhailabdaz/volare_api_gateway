import App from "./app"
import "dotenv/config"

const port = Number(process.env.API_GATEWAY_PORT)
new App().startServer(port)