const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ email, password }) {
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    const user = await User.insertUser({
      email,
      passwordHash,
    });
    return user;
  }

  static async signIn({ email, password = '' }) {
    try {
      const user = await User.getByEmail(email);
      if (!user) throw new Error('Invalid email and password');
      console.log(
        '🚀 ~ file: UserService.js ~ line 23 ~ UserService ~ signIn ~ password ------ ',
        password
      );
      if (!bcrypt.compareSync(password, user.passwordHash))
        throw new Error('Invalid password');

      const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });
      return token;
    } catch (error) {
      error.status = 401;
      throw error;
    }
  }
};
