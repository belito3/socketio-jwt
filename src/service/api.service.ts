import {RxHR, RxHttpRequest} from "@akanass/rx-http-request";
import { AppConfiguration } from "../app.config";

// link: https://github.com/njl07/rx-http-request
export class ApiService{
    
    private _http: RxHttpRequest;

    constructor(){
        this._http = RxHR;
    }

    public logout(username: string){
        let url_path = AppConfiguration.api_url + AppConfiguration.version_path + AppConfiguration.sys_path + 
                        AppConfiguration.user_path + AppConfiguration.auth_path + AppConfiguration.logout_path;
        const options = {
            body: {
                UserName: username
            },
            json: true // Automatically stringifies the body to JSON
        }
        return this._http.post(url_path, options);
    }
}