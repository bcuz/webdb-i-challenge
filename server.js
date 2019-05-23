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

server.get('/accounts/:id', validateAccountId, async (req, res) => {
  res.json(req.account);  
});

server.post('/accounts', async (req, res) => {
  //  non-unique name will be a 500 error
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

server.delete('/accounts/:id', validateAccountId, async (req, res) => {

  try {
    await Accounts.remove(req.params.id);        
    res.status(200).json({ message: 'The account has been nuked' });
    
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error removing the account',
    });
  }
});

server.put('/accounts/:id', validateAccountId, async (req, res) => {
  // might refactor later.
  
  if(Object.keys(req.body).length === 0){
    res.status(400).json({message: "missing data"});
  }

  try {
    const account = await Accounts.update(req.params.id, req.body);  

    res.status(200).json(account);    
    
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error updating the account',
    });
  }

});

async function validateAccountId(req, res, next) {

  try {
  const account = await Accounts.findById(req.params.id);

  if (account) {
    req.account = account
    next()
  } else {
    res.status(404).json({ message: 'account not found; invalid id' });
  }    
  } catch (err) {
    res.status(500).json({ message: 'failed to process request' });    
  }
};

module.exports = server;