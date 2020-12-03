const connection = require('./config');
const express = require('express');
const app = express();
const axios = require('axios');

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

app.use(express.json());

const newUsers = [];

const getUsers = () => {
  return connection.promise().query('SELECT * FROM users');
};

const main = async () => {
  const [users] = await getUsers();
  users.forEach((user) => {
    axios
      .get(`https://api.github.com/users/${user.github_username}/repos`)
      .then((results) => results.data)
      .then((results) =>
        results.map((repository) =>
          connection
            .promise()
            .query(
              'INSERT INTO repositories(name,url,users_id) VALUES (?, ?, ?)',
              [repository.name, repository.url, user.id]
            )
        )
      );
  });
};

main();

const getRepos = () => {
  newUsers.forEach((user) => {
    axios
      .get(`https://api.github.com/users/${user}/repos`)
      .then((results) => console.log(results));
  });
};

getUsers();
getRepos();
