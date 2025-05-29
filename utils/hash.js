const bcrypt = require('bcryptjs');

const hashPassword = async (plainTextPassword) => {
  const saltRounds = 10;
  return await bcrypt.hash(plainTextPassword, saltRounds);
};

const comparePassword = async (plainTextPassword, hashedPassword) => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export {
  hashPassword,
  comparePassword
};
