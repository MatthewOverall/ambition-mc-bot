import express from "express";
import config from "./config.json";
import AmbitionClient from "./src/AmbitionClient";
import DiscordBot from "./src/DiscordBot";

const app = express();
const port = 3000;
const ambitionClient = new AmbitionClient(config);
const discordBot = new DiscordBot(ambitionClient);
discordBot.start();
discordBot.once("ready", () => {
  console.log("discord bot listening");
});

app.get("/", (req, res) => {
  res.send("The sedulous hyena ate the antelope!");
});

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
