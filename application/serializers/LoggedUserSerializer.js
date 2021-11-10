const serializeUser = (user) => ({
    id: user.id,
    token: user.token,
    firstName: user.firstName,
    lastName: user.lastName,
    rol: user.rol
  });
  
  module.exports = (data) => {
    if (!data) {
      throw new Error("Expect data to be not undefined nor null");
    }
  
    if (Array.isArray(data)) {
      return data.map(serializeUser);
    }
    return serializeUser(data);
  };
  