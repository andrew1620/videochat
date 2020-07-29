const kurento = require("kurento-client");
const { users } = require("../../data/db/users");
const { room } = require("../Room/room");

class RoomParticipant {
  constructor() {
    this.publishEndpoint = null;
    this.viewEndpoints = {};
    this.candidatesQueue = {};
  }
  getPublishEndpoint() {
    return this.publishEndpoint;
  }
  async createPublishEndpoint() {
    const pipeline = await room.getPipeline();

    if (!this.publishEndpoint)
      this.publishEndpoint = await pipeline.create("WebRtcEndpoint");
    return this.publishEndpoint;
  }

  getViewEndpoints() {
    return this.viewEndpoints;
  }
  addViewEndpoint(userId, endpoint) {
    this.viewEndpoints[userId].endpoint = endpoint;
  }

  getViewEndpoint(userId) {
    if (this.viewEndpoints[userId]) return this.viewEndpoints[userId].endpoint;
  }
  deleteViewEndpoint(userId) {
    if (this.viewEndpoints[userId]) {
      delete this.viewEndpoints[userId];
      // console.log(`viewEndpoint deleted ---  ${userId}`);
    }
  }
  async createViewEndpoint(userId) {
    if (!this.viewEndpoints[userId]) {
      const pipeline = await room.getPipeline();
      this.viewEndpoints[userId] = {};
      this.viewEndpoints[userId].endpoint = await pipeline.create(
        "WebRtcEndpoint"
      );
    }
    return this.viewEndpoints[userId].endpoint;
  }
  getCandidatesQueue(userId) {
    return this.candidatesQueue[userId];
  }
  addCandidateToQueue(userId, candidate) {
    if (!this.candidatesQueue[userId]) this.candidatesQueue[userId] = [];
    this.candidatesQueue[userId].push(candidate);
  }

  clearCandidatesQueue(userId) {
    if (this.candidatesQueue[userId]) {
      delete this.candidatesQueue[userId];
    }
  }
}
module.exports = RoomParticipant;
