'use strict';

const bcrypt = require('bcrypt-as-promised');
const express = require('express');
const knex = require('../knex');

const router = express.Router();

router.post('/users', (req, res, next) => {
  bcrypt.hash(req.body.password, 12)
  .then((hashed_password) => {
    return knex('users').insert({
      email: req.body.email,
      hashed_password: hashed_password
    }, '*');
  })
  .then((rows) => {
    const user = rows[0];

    delete user.hashed_password;

    req.session.userId = user.id;

    res.send(user);
  })
  .catch((err) => {
    next(err);
  });
});

router.delete('/session', (req, res, next) => {
  req.session = null;

  res.sendStatus(200);
});

module.exports = router;
