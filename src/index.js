const PORT = process.env.PORT || 8001;
const ENV = require("./environment");
const db = require("./db");
const seed = require("./db/seed");

const app = require("./application")(ENV, { updateAppointment });
const server = require("http").Server(app);

const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
  socket.onmessage = (event) => {
    console.log(`Message Received: ${event.data}`);

    if (event.data === "ping") {
      socket.send(JSON.stringify("pong"));
    }
  };
});

function updateAppointment(id, interview) {
  wss.clients.forEach(function eachClient(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "SET_INTERVIEW",
          id,
          interview,
        })
      );
    }
  });
}

seed(db)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT} in ${ENV} mode.`);
    });
  })
  .catch((error) => {
    console.error(`Failed to start: ${error}`);
    process.exit(1);
  });
