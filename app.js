const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

let app = express();
app.use(express.json());

const filepath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: filepath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(error);
  }
};

initializeDBAndServer();

function getquery(status, category, priority) {
  console.log(status, category, priority);
  let codedString = "";
  if (status === undefined) {
    codedString += "0";
  } else {
    codedString += "1";
  }

  if (category === undefined) {
    codedString += "0";
  } else {
    codedString += "1";
  }

  if (priority === undefined) {
    codedString += "0";
  } else {
    codedString += "1";
  }

  //console.log(codedString, typeof codedString);

  let minQuery = `
  SELECT *
  FROM todo`;

  let condition = null;
  let Query = null;
  if (codedString === "000") {
    let Query = minQuery;
    return Query;
  } else if (codedString === "100") {
    console.log("YES");
    let condition = ` WHERE status="${status}";`;
    let Query = minQuery + condition;
    return Query;
  } else if (codedString === "010") {
    let condition = ` WHERE category="${category}";`;
    let Query = minQuery + condition;
    return Query;
  } else if (codedString === "001") {
    let condition = ` WHERE priority="${priority}";`;
    let Query = minQuery + condition;
    return Query;
  } else if (codedString === "110") {
    let condition = ` WHERE (status="${status}" AND category="${category}");`;
    let Query = minQuery + condition;
    return Query;
  } else if (codedString === "101") {
    let condition = ` WHERE (status="${status}" AND "priority=${priority}");`;
    let Query = minQuery + condition;
    return Query;
  } else if (codedString === "011") {
    let condition = `WHERE (category = "${category}" AND priority="${priority}");`;
    let Query = minQuery + condition;
    return Query;
  } else if (codedString === "111") {
    let condition = `WHERE (status="${status}" AND category="${category}" AND priority="${priority}");`;
    let Query = minQuery + condition;
    return Query;
  }
}

//API 1

app.get("/todos/", async (request, response) => {
  const queries = request.query;
  const { status, priority, progress } = queries;
  //console.log(status, priority, progress);
  let newQuery = getquery(status, priority, progress);
  console.log(newQuery);
  const dbResponse = db.all(newQuery);
  response.send(dbResponse);
});

//API 2

module.exports = app;
