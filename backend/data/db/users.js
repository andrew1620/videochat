const { uuid } = require("uuidv4");

const config = require("../../config/index");

const fullRoomError = new Error("Room is full");
const userDoesntExist = new Error(`User doesn't exist`);

class createDB {
  constructor() {
    this.db = {};
  }

  getDB() {
    return this.db;
  }

  addUser(name) {
    if (Object.keys(this.db).length === config.usersAmount) {
      throw fullRoomError;
    }

    const newId = uuid();
    this.db[newId] = { id: newId, name, videoStop: true, muted: true };
    return { id: newId, name };
  }

  getUser(userId) {
    const isUserExist = this._checkUserExist(userId);
    if (!isUserExist) {
      throw userDoesntExist;
    }

    const foundUser = this.db[userId];
    return foundUser;
  }
  getByName(name) {
    const user = this._checkUsernameExist(name);
    if (!user) {
      throw userDoesntExist;
    }
    return user;
  }
  getBySocket(socketId) {
    for (let key in this.db) {
      if (this.db[key].socketId === socketId) {
        return this.db[key];
      }
    }
  }

  updateUser(userId, newUserData) {
    const isUserExist = this._checkUserExist(userId);
    if (!isUserExist) {
      throw userDoesntExist;
    }

    this.db[userId] = { ...this.db[userId], ...newUserData };
    const updatedUser = this.db[userId];
    return updatedUser;
  }

  deleteUser(userId) {
    const isUserExist = this._checkUserExist(userId);
    if (!isUserExist) {
      throw userDoesntExist;
    }

    const deletedUser = this.db[userId];
    delete this.db[userId];
    return deletedUser;
  }

  _checkUserExist(id) {
    return !!this.db[id];
  }
  _checkUsernameExist(name) {
    return Object.entries(this.db).find(([id, value]) => value.name === name);
  }
}

module.exports.users = new createDB();
