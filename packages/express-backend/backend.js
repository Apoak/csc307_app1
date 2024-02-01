// backend.js
import express from "express";
import cors from "cors";


const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};
app.get("/users", (req, res) => {
  res.send(users);
});

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserByNameJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};

app.get("/users", (req, res) => {
 const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const idr = Math.random() * 100000000000000000;
  userToAdd.id = String(idr);
  addUser(userToAdd);
  res.status(201).send({userToAdd});
});

const findUserIndexById = (userId) => {
  return users["users_list"].findIndex(
    (user) => user["id"] === userId
  );
};

const deleteUser = (idx) =>{
  if (idx !== -1) {
    const deleted = users["users_list"].splice(idx, 1)[0];
    return {Terminated: true, deleted};
}
console.log("User not found");
  return { success: false };}

app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  const Result = deleteUser(userId);
  //const index = findUserById(userId);
  if(Result.Terminated){
    res.status(200).send({ message: `User with ID ${userId} deleted successfully.` });
  }
  else {
    res.status(404).json({ error: `User with ID ${userId} not found.` });
  }
}
)

app.get("/users", (req, res) => {
 const name = req.query.name;
 const job = req.query.job;
  if (name != undefined) {
    if (job != undefined){
      const result = findUsersByNameAndJob(name, job);
      res.json({ users_list: result });
    }
  } else {
    res.send(users);
  }
});
