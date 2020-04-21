// TODO: store users in DB

const users = [];

const addUser = ({ id, room, username }) => {
  // Clean the data
  room = room.trim().toLowerCase();
  username = username.trim().toLowerCase();

  // Validate the data
  if (room === undefined || username === undefined) {
    return {
      error: "Username and room are required!",
    };
  }

  // Check for existing user
  const isExistingUser = users.find(
    (user) => user.room === room && user.username === username
  );

  // Validate username
  if (isExistingUser) {
    return {
      error: "Username is in use!",
    };
  }

  // Store user
  const user = { id, room, username };

  users.push(user);

  return { user };
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  const isUserFound = index !== -1;

  if (isUserFound) {
    return users.splice(index, 1)[0];
  }
};

module.exports = {
  addUser,
  getUser,
  getUsersInRoom,
  removeUser,
};
