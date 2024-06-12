import "dotenv/config";
import express from "express";
import http from "http";
import userRoute from "./modules/user/routes.js";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import "dotenv/config";
class App {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.applyMiddleware();
        this.routes();
    }
    applyMiddleware() {
        this.app.use(cors);
        this.app.use(helmet());
        this.app.use(cookieParser());
    }
    routes() {
        this.app.use("/api/v1/user", userRoute);
    }
    startServer(port) {
        this.server.listen(port, () => {
            console.log(`The API Gateway started at PORT${port}`);
        });
    }
}
export default App;
//# sourceMappingURL=app.js.map