const locations = require('./locations')
console.log(locations)

// SETUP
const express = require('express')
const app = express()
app.get('/', (req, res) => { res.send('Hello World!') })
app.listen(3001, () => { console.log('Server running on port 3001') })

//Use node index.js in the terminal for execute the script.
//Warning: Firefox does not fully support the editor. Please use a chromimum-based web browser such as Chrome, Brave or Edge.
//This script is a basic example of a player's movement. You can load other examples by clicking on "Load example".
const server = "https://api.artifactsmmo.com";
//Your token is automatically set
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Ik1lYXN0cm9tYW4iLCJwYXNzd29yZF9jaGFuZ2VkIjoiIn0.92NzgFYqigCmztUoZ7HiaQXGuEzK0bmBKj5JbdThyNk";
//Put your character name here
const character = "Meastroman";

const characters = ['Meastroman', 'Anleifr', 'BlikBrood', 'NullPointer', 'AshKetchum']

let cooldown
let timeout

async function movement(x, y) {
      
  const url = server + '/my/' + character +'/action/move';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify({
        "x": x,
        "y": y
      }) //change the position here
  };
  
  try {
    const response = await fetch(url, options);
    const { data } = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
  
//This script is an example of how to loop each time cooldown is complete.
async function performFight() {
    const url = server + '/my/' + character + '/action/fight';
  
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    };
  
    return fetch(url, {
      method: 'POST',
      headers: headers,
    }).then((fightResponse) => {
      if (fightResponse.status === 498) {
        console.log('The character cannot be found on your account.')
        return;
      }
      else if (fightResponse.status === 497) {
        console.log("Your character's inventory is full.")
        return;
      }
      else if  (fightResponse.status === 499) {
        console.log('Your character is in cooldown.')
        return;
      }
      else if (fightResponse.status === 598) {
        console.log('No monster on this map.')
        return;
      }
      else if (fightResponse.status !== 200) {
        console.log('An error occurred during the fight.')
        return;
      }
  
      if (fightResponse.status === 200) {
        fightResponse.json().then((data) => {
              console.log('The fight ended successfully. You have '+ data.data.fight.result +'.')
              cooldown = data.data.cooldown.total_seconds
              setTimeout(performFight, cooldown * 1000)
        })
  
      }
        })
  }
  
performFight()