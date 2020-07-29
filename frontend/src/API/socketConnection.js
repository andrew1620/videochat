import io from "socket.io-client";
const socket = io(
  process.env.NODE_ENV === "development"
    ? `${document.location.protocol}//${document.location.hostname}:1337`
    : `${document.location.origin}`,
  { autoConnect: false }
);
// const socket = io("http://localhost:1337/", { autoConnect: false });

export class SocketController {
  constructor(socket) {
    this.socket = socket;
  }
  connect() {
    this.socket.open();
  }
  disconnect() {
    this.socket.close();
  }
  on(eventName, handler) {
    this.socket.on(eventName, handler);
  }
  emit(eventName, data, responseHandler) {
    this.socket.emit(eventName, data, responseHandler);
  }
  sendMessage(message) {
    this.socket.emit("message", { message });
  }
}
export const socketController = new SocketController(socket);
export default socket;
