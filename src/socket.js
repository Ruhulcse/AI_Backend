
module.exports = function (io) {
  // socket connection
  io.on("connection", async function (socket) {
    console.log(`⚡: ${socket.id} user just connected`);
    // socket.emit("greeting-from-server", {
    //   greeting: "Hello Client",
    // });
    // socket.on("greeting-from-client", function (message) {
    //   console.log(message);
    // });

    //Whenever someone disconnects this piece of code executed
    socket.on("disconnect", function () {
      console.log("A user disconnected", socket.id);
    });

    // socket.on("message", (data) => {
    //   //sends the data to everyone except you.
    //   socket.broadcast.emit("response", data);

    //   //sends the data to everyone connected to the server
    //   // socket.emit("response", data)
    // });
  });
  return io;
};
