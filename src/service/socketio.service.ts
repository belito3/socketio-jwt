import  * as io from 'socket.io-client';

export class SocketIOService{
    socket(uri_path: string, token: any){
        return io(uri_path, token);
    };
}