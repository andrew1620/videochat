const kurento = require("kurento-client");
const config = require("../../config/index");

class Room {
  constructor() {
    this.kurentoClient = null;
    this.pipeline = null;
    this.users = {};
  }
  async setKurentoClient() {
    if (this.kurentoClient !== null) return;

    try {
      const _kurentoClient = await kurento(config.kurentoUrl);
      this.kurentoClient = _kurentoClient;
      return _kurentoClient;
    } catch (err) {
      throw new Error(
        "Could not find media server at address" +
          config.kurentoUrl +
          ". Exiting with error " +
          err
      );
    }
  }
  async createPipeline() {
    try {
      const pipeline = await this.kurentoClient.create("MediaPipeline");
      this.pipeline = pipeline;
      return this.pipeline;
    } catch (error) {
      console.log(error);
    }
  }
  async getPipeline() {
    if (!this.pipeline) {
      await this.createPipeline();
    }
    return this.pipeline;
  }
  async connectEndpoint(userToConnect, endpoint) {
    await this.users[userToConnect].publishEndpoint.connect(endpoint);
  }
  deleteRoomParticipant(userId) {
    if (this.users[userId]) {
      delete this.users[userId];
      console.log("roomParticipant deleted ", userId);
    }
  }
  addUser(userId, newUser) {
    this.users[userId] = newUser;
  }
  getUsers() {
    return this.users;
  }
}

module.exports.room = new Room();
