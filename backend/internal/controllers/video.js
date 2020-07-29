const RoomParticipant = require("../RoomParticipant/roomParticipant");
const { room } = require("../Room/room");
const { users } = require("../../data/db/users");
const VideoChatParticipant = require("../VideoChatParticipant/VideoChatParticipant");

room.setKurentoClient();

module.exports.video = (socket) => {
  console.log("socket connected");
  const roomParticipant = new RoomParticipant();
  const videoChatParticipant = new VideoChatParticipant();
  socket.join("videoRoom");

  socket.on("message", async (data, cb) => {
    const message = data.message;

    switch (message.id) {
      case "startStream": {
        room.addUser(message.userId, roomParticipant);
        const _user = users.getUser(message.userId);
        const sdpAnswer = await videoChatParticipant.publish(
          _user,
          message.sdpOffer,
          socket,
          roomParticipant
        );
        socket.emit("message", {
          message: {
            id: "startStreamResponse",
            response: "accepted",
            sdpAnswer,
            viewPeer: _user.id,
            videoStop: users.getUser(message.userId).videoStop,
            muted: users.getUser(message.userId).muted,
          },
        });
        socket.to("videoRoom").emit("message", {
          message: { id: "videoChat:published", userId: _user.id },
        });
        break;
      }
      case "startView": {
        const sdpAnswer = await videoChatParticipant.view(
          users.getUser(message.userId),
          message.userToView,
          message.sdpOffer,
          socket,
          roomParticipant,
          room
        );
        socket.emit("message", {
          message: {
            id: "startViewResponse",
            sdpAnswer,
            viewPeer: message.userToView,
            videoStop: users.getUser(message.userToView).videoStop,
            muted: users.getUser(message.userToView).muted,
          },
        });
        break;
      }
      case "onIceCandidate":
        videoChatParticipant.onIceCandidate(
          message.candidate,
          message.userId,
          message.title,
          message.userToView,
          roomParticipant
        );
        break;
      case "stop":
        videoChatParticipant.stopCommunication(
          message.userId,
          socket,
          roomParticipant
        );
      default:
        socket.emit({
          id: "error",
          message: `Invalid message ${message}`,
        });
        break;
    }
  });
  socket.on("getUsers", (data, cb) => {
    return cb({ users: users.getDB() });
  });
  socket.on("addSocketId", (data, cb) => {
    users.updateUser(data.userId, { socketId: socket.id });
  });
  socket.on("disconnect", () => {
    const userId = videoChatParticipant.stopCommunication(
      null,
      socket,
      roomParticipant
    );
    room.deleteRoomParticipant(userId);
    socket.to("videoRoom").emit("message", {
      message: {
        id: "stopCommunication",
        userId,
      },
    });
  });
  socket.on("user:mute", (data) => {
    console.log("user muted --- ", data);
    users.updateUser(users.getBySocket(socket.id).id, {
      muted: data.muted,
    });
    socket
      .to("videoRoom")
      .emit("user:mute", { userId: data.userId, muted: data.muted });
  });
  socket.on("user:videoStop", (data) => {
    console.log("user video stop --- ", data);
    console.log(users.getBySocket(socket.id));
    users.updateUser(users.getBySocket(socket.id).id, {
      videoStop: data.videoStop,
    });
    socket.to("videoRoom").emit("user:videoStop", {
      userId: data.userId,
      videoStop: data.videoStop,
    });
  });
};
