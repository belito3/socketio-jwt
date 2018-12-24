import  * as jwt from "jsonwebtoken";
import { AppConfiguration } from "./app.config";
import { SocketIOService } from "./service/socketio.service";

let payload = {"Data" : "token-for-api-update-device-register"}
let _token = jwt.sign(payload, AppConfiguration.SECRET, {expiresIn: AppConfiguration.TOKEN_LIFE});
this._socket = new SocketIOService().socket(AppConfiguration.WS_URL, {
    query: {token: _token}
});