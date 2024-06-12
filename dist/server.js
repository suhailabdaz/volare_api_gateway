import App from "./app.js";
import "dotenv/config";
const port = Number(process.env.APIgateway_port);
new App().startServer(port);
//# sourceMappingURL=server.js.map