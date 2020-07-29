class WebRtcPeers {
  constructor() {
    this.peers = {};
  }
  getPeers() {
    return this.peers;
  }
  getPeer(peerId) {
    if (this.peers[peerId]) return this.peers[peerId];
  }
  addPeer(peerId, newPeer) {
    this.peers[peerId] = newPeer;
  }
  deletePeer(peerId) {
    if (this.peers[peerId]) delete this.peers[peerId];
  }
}
const webRtcPeers = new WebRtcPeers();

export default webRtcPeers;
