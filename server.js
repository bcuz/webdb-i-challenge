const express = require('express');
const Accounts = require('./data/accounts-model.js');

const server = express();
server.use(express.json());

server.get('/accounts', async (req, res) => {
  try {
    const accounts = await Accounts.find();
    res.status(200).json(accounts);
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the accounts',
    });
  }
});

server.get('/accounts/:id', async (req, res) => {
  // might refactor later
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

server.post('/accounts', async (req, res) => {
  // no specific error for non-unique name
  let { name, budget } = req.body;

  if (!name || !budget) {    
    return res.status(400).json({ message: "Please provide name and budget for the account." });
  }

  try {
    const account = await Accounts.add(req.body);
    res.status(201).json(account);
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error adding the account',
    });
  }
  
});

module.exports = server;