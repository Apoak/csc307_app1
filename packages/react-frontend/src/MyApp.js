// src/MyApp.js
import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

/////////////////////////
  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
}

/////////////////////////
function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  function removeOneCharacter(idx, id) {
    return fetch(`http://localhost:8000/users/${idx}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.status === 204) {
          const changed = characters.filter((character, i) => {
          return i !== idx;
          });
          setCharacters(changed);
        } else if (res.status === 404) {
          throw new Error('User not found.');
        } else {
          throw new Error('Failed to delete user.');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

///////////////////////
function updateList(person) { 
    postUser(person)
      .then((res) => {
        if(res.status === 201){
          return res.json();
        }
      })
      .then((updatedUser) => {
        if (updatedUser) {
          setCharacters([...characters, updatedUser]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
}
/////////////////////////
useEffect(() => {
  fetchUsers()
	  .then((res) => res.json())
	  .then((json) => setCharacters(json["users_list"]))
	  .catch((error) => { console.log(error); });
}, [] );

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter}/>
      <Form handleSubmit={updateList} />
      {/* <Form handleSubmit={deleteList} /> */}
    </div>
  );
}

export default MyApp;
