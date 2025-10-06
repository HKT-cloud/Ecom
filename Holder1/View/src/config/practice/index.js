import http from "http";

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.end("home Page");
  }
});

server.listen(3030, () => {
  console.log("Port Running on 3030");
});
