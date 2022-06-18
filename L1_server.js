const http = require("http");

const server = http.createServer((req, res) => {
  console.log("Request has been made");
  res.setHeader("Content-Type", "text/html");
  res.write("<h1>Hello Pepcoders</h1>");
  res.end();
});

server.listen(4000, "localhost", () => {
  console.log("Server is Listening on 4000");
});
