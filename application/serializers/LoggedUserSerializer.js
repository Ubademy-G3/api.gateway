const serializeUser = (user) => ({
  id: user.id,
  token: user.token,
  firstName: user.firstName,
  lastName: user.lastName,
  rol: user.rol,
  subscriptionState: user.subscriptionState,
});

module.exports = (data) => {
  if (!data) {
    /* istanbul ignore next */
    throw new Error("Expect data to be not undefined nor null");
  }
  /* istanbul ignore next */
  if (Array.isArray(data)) {
    return data.map(serializeUser);
  }
  return serializeUser(data);
};
