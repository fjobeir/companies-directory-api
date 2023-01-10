const userTransformer = (user) => {
  if (user?.dataValues?.password) {
    delete user.dataValues.password;
  }
  if (user?.avatar) {
    user.avatar = process.env.server_url + user.avatar;
  }

  return user;
};

const usersTransformer = (users) => {
  return users.map((user) => userTransformer(user));
};
module.exports = {
  userTransformer,
  usersTransformer,
};
