const { execSync } = require("child_process");
const { default: { stream } } = require("got");
const { createWriteStream, existsSync } = require("fs");

const grab = require("./handlers/grab");

const start = () => {
    execSync("java -jar Lavalink.jar", { stdio: "inherit" });
};

const file = "./Lavalink.jar";

if (existsSync(file)) {
    console.log("Lavalink.jar exist, starting...");
    start();
} else {
    console.log("Lavalink.jar doesn't exist, downloading...");
    grab();
}