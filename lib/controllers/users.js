const { Router } = require('express');
const UserService = require('../services/UserService');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const userCreated = await UserService.create(req.body);
      res.json(userCreated);
    } catch (error) {
      next(error);
    }
    // res.json({
    //   id: '1',
    //   email: 'ted.com',
    //   password: '1254',
    // });
  })

  .post('/sessions', async (req, res, next) => {
    console.log('req body -------> ', req.body);
    try {
      const userSignedIn = await UserService.signIn(req.body);
      console.log(
        '🚀 ~ file: users.js ~ line 26 ~ .post ~ userSignedIn',
        userSignedIn
      );
      // res.json(userSignedIn);
      res
        .cookie(process.env.COOKIE_NAME, userSignedIn, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .json({ message: 'You are Signed In' });
    } catch (error) {
      next(error);
    }
  })

  .delete('/sessions', async (req, res, next) => {
    try {
      res
        .clearCookie(process.env.COOKIE_NAME)
        .json({ success: true, message: 'Signed out successfully' });
    } catch (error) {
      next(error);
    }
  });
