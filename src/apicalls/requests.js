import axios from "axios";
import { GetToken } from "./auth";
axios.defaults.baseURL = "https://localhost:44322/api";

const responseBody = (response) => response;
const handleError = (err) => {
  if (err.response) {
    console.log(err.response.data);
    console.log(err.response.status);
    console.log(err.response.headers);
  } else if (err.request) {
    console.log(err.request);
  } else {
    console.log("Error", err.message);
  }

  return err;
};

const requests = {
  get: (url, config) =>
    axios.get(url, config).then(responseBody).catch(handleError),
  post: (url, body, config) =>
    axios.post(url, body, config).then(responseBody).catch(handleError),
  put: (url, body, config) =>
    axios.put(url, body, config).then(responseBody).catch(handleError),
  patch: (url, patchDoc, config) =>
    axios.patch(url, patchDoc, config).then(responseBody).catch(handleError),
  delete: (url, config) =>
    axios.delete(url, config).then(responseBody).catch(handleError),
};

export const Tasks = {
  list: (params) => {
    return requests.get("/tasks", {
      params: params,
      headers: {
        Authorization: `Bearer ${GetToken()}`,
      },
    });
  },

  details: (id) =>
    requests.get(`/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${GetToken()}`,
      },
    }),

  add: (task) =>
    requests.post("/tasks", task, {
      headers: {
        Authorization: `Bearer ${GetToken()}`,
      },
    }),

  put: (id, task) =>
    requests.put(`/tasks/${id}`, task, {
      headers: {
        Authorization: `Bearer ${GetToken()}`,
      },
    }),

  patch: (id, patchDoc) =>
    requests.patch(`/tasks/${id}`, patchDoc, {
      headers: {
        Authorization: `Bearer ${GetToken()}`,
      },
    }),

  delete: (id) =>
    requests.delete(`/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${GetToken()}`,
      },
    }),
};

export const Steps = {
  add: (step) =>
    requests.post("/steps", step, {
      headers: {
        Authorization: `Bearer ${GetToken()}`,
      },
    }),

  patch: (id, patchDoc) =>
    requests.patch(`/steps/${id}`, patchDoc, {
      headers: {
        Authorization: `Bearer ${GetToken()}`,
      },
    }),

  delete: (id) =>
    requests.delete(`/steps/${id}`, {
      headers: {
        Authorization: `Bearer ${GetToken()}`,
      },
    }),
};

export const Users = {
  signup: (user) => requests.post("/users/signup", user).catch(handleError),

  signin: (user) => requests.post("/users/signin", user).catch(handleError),

  listUsersWithTask: (taskId) =>
    requests.get(`/users/task/${taskId}`, {
      headers: {
        Authorization: `Bearer ${GetToken()}`,
      },
    }),
};

export const Tags = {
  list: (tagName) => {
    return requests.get(`/tags/${tagName}`, {
      headers: {
        Authorization: `Bearer ${GetToken()}`,
      },
    });
  },
};

export const UserTasks = {
  share: (userTask) =>
    requests.post("/usertasks", userTask, {
      headers: {
        Authorization: `Bearer ${GetToken()}`,
      },
    }),

  unshare: (userTask) =>
    requests.delete("/usertasks/", {
      headers: {
        Authorization: `Bearer ${GetToken()}`,
      },
      data: {
        email: userTask.email,
        taskId: userTask.taskId,
      },
    }),
};

export const Notes = {
  add: (note) =>
    requests.post("/notes", note, {
      headers: {
        Authorization: `Bearer ${GetToken()}`,
      },
    }),

  delete: (id) =>
    requests.delete(`/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${GetToken()}`,
      },
    }),

  patch: (id, patchDoc) =>
    requests.patch(`/notes/${id}`, patchDoc, {
      headers: {
        Authorization: `Bearer ${GetToken()}`,
      },
    }),
};
