const https = require("https");
const fs = require("fs");

const callback = (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("success");
  }
};

function getPeople(CBfunc) {
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
      const northcodersString = JSON.stringify(northcoders, null, 2); //.stringify turns json into a string
      fs.writeFile("northcoders.json", northcodersString, (err) => {
        if (err) {
          CBfunc(err);
        } else {
          CBfunc(null);
        }
      });
    });
  });
  request.end();
}

//getPeople(callback);

function getInterests(CBfunc) {
  fs.readFile("./northcoders.json", "utf-8", (err, content) => {
    if (err) {
      console.log(err);
    } else {
      const ncUsersArr = JSON.parse(content);
      const newArray = [];
      //let count = 0;
      ncUsersArr.forEach((northcoder /*,index*/) => {
        const options = {
          hostname: "nc-leaks.herokuapp.com",
          path: `/api/people/${northcoder.username}/interests`,
          method: "GET",
        };
        const request = https.request(options, (response) => {
          let body = "";
          response.on("data", (packet) => {
            body += packet.toString();
          });
          response.on("end", () => {
            //count++;
            const parsedPerson = JSON.parse(body); //JSON.parse turnes a string into a json object
            newArray.push(parsedPerson.person);
            //newArray[index] = parsedPerson.person

            //if (count === ncUsersArr.length) {
            fs.writeFile(
              "./interests.json",
              JSON.stringify(newArray, null, 2),
              (err) => {
                if (err) {
                  CBfunc(err);
                } else {
                  CBfunc(null);
                }
              }
            );
            //}
          });
        });
        request.end();
      });
    }
  });
}

//getInterests(callback);
//the count and index stuff is only important if you want to maintain the order
//count is required to make

function getPets(CBfunc) {
  fs.readFile("./northcoders.json", "utf-8", (err, content) => {
    if (err) {
      console.log(err);
    } else {
      const ncUsersArr = JSON.parse(content);
      const petsArray = [];
      ncUsersArr.forEach((northcoder) => {
        const options = {
          hostname: "nc-leaks.herokuapp.com",
          path: `/api/people/${northcoder.username}/pets`,
          method: "GET",
        };
        const request = https.request(options, (response) => {
          if (response.statusCode !== 404) {
            let body = "";
            response.on("data", (packet) => {
              body += packet.toString();
            });
            response.on("end", () => {
              const parsedPeopleWithPets = JSON.parse(body); //JSON.parse turnes a string into a json object

              // if (parsedPeopleWithPets.person.length !== 0) {
              petsArray.push(parsedPeopleWithPets.person);

              fs.writeFile(
                "pets.json",
                JSON.stringify(petsArray, null, 2),
                (err) => {
                  if (err) {
                    CBfunc(err);
                  } else {
                    CBfunc(null);
                  }
                }
              );
              //}
            });
          }
        });
        request.end();
      });
    }
  });
}

getPets(callback);

//vvvvvworks but scrws up getPets
// function scavengeForNcData() {
//   getPeople((err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       fs.access("./northcoders.json", (err) => {
//         if (err) {
//           console.log(err);
//         } else {
//           getInterests((err) => {
//             if (err) {
//               console.log(err);
//             }
//           });
//           getPets((err) => {
//             if (err) {
//               console.log(err);
//             }
//           });
//         }
//       });
//     }
//   });
// }

// scavengeForNcData(callback);
