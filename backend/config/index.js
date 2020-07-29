const config = {
  // port: 1337,
  port: process.env.PORT || 1337,
  usersAmount: 4,
  kurentoUrl: process.env.KURENTO_URL || "ws://localhost:8888/kurento",
  // kurentoUrl: "ws://localhost:8888/kurento",
  turnUrl: "forasoft:ajhfcjanfqccthdth@144.76.81.36:3478",
  stunIp: "64.233.161.127",
  stunPort: "19302",
};

module.exports = config;
