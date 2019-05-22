const express = require('express');
const Accounts = require('./data/accounts-model.js');

const server = express();

server.get('/accounts/:id', async (req, res) => {

  try {
    const account = await Accounts.findById(req.params.id);      

    if (account) {
      res.status(200).json(account);
    } else {
      res.status(404).json({ message: 'account not found' });
    }
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the account',
    });
  }  
});

module.exports = server;