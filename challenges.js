https = require("https");
const fs = require("fs");

function getPeople() {
  const options = {
    hostname: "nc-leaks.herokuapp.com",
    path: "/api/people",
    method: "GET",
  };
  const request = https.request(options, (response) => {
    let body = "";
    response.on("data", (packet) => {
      body += packet.toString();
    });
    response.on("end", () => {
      const parsedPeople = JSON.parse(body); //JSON.parse turnes a string into a json object
      const people = parsedPeople.people;
      const northcoders = people.filter((person) => {
        return person.job.workplace === "northcoders";
      });
      const northcodersString = JSON.stringify(northcoders); //.stringify turns json into a string
      fs.writeFile("northcoders.json", northcodersString, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  });
  request.end();
}

getPeople();
