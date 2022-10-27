const https = require("https");
const fs = require("fs");

function getInstructions() {
  const options = {
    hostname: "nc-leaks.herokuapp.com",
    path: "/api/confidential",
    method: "GET",
  };

  const request = https.request(options, (response) => {
    let body = "";
    response.on("data", (packet) => {
      body += packet.toString();
    });

    response.on("end", () => {
      const parsedBody = JSON.parse(body);
      fs.writeFile("./instructions.md", parsedBody.instructions, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Got them structions!");
        }
      });
    });
  });
  request.end();
}

getInstructions();
