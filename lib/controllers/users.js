const { Router } = require('express');
const UserService = require('../services/UserService');

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
});
