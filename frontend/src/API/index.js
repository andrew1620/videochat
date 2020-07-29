import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:1337/",
  baseURL: `${
    process.env.NODE_ENV === "development"
      ? `${document.location.protocol}//${document.location.hostname}:1337`
      : `${document.location.origin}`
  }`,
});

export const authAPI = {
  async authorize(name) {
    try {
      const response = await instance.post("auth", { name });
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  },
};
