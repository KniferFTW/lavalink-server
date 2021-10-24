const { createWriteStream, existsSync } = require("fs");
const { execSync } = require("child_process");
const _cliProgress = require('cli-progress');
const request = require('request')

module.exports = () => {
const url = `https://ci.fredboat.com/repository/download/Lavalink_Build/.lastSuccessful/Lavalink.jar?guest=1&branch=refs/heads/dev`;

const grab = (url, filename, callback) => {

    const progressBar = new _cliProgress.SingleBar({
        format: '{bar} {percentage}% | Lavalink.jar ETA: {eta}s'
    }, _cliProgress.Presets.shades_classic);

    const file = createWriteStream(filename);
    let receivedBytes = 0

    request.get(url)
    .on('response', (response) => {
        if (response.statusCode !== 200) {
            return callback('Response status was ' + response.statusCode);
        }

        const totalBytes = response.headers['content-length'];
        progressBar.start(totalBytes, 0);
    })
    .on('data', (chunk) => {
        receivedBytes += chunk.length;
        progressBar.update(receivedBytes);
    })
    .pipe(file)
    .on('error', (err) => {
        fs.unlink(filename);
        progressBar.stop();
        return callback(err.message);
    });

    file.on('finish', () => {
        progressBar.stop();
        execSync("java -jar Lavalink.jar", { stdio: "inherit" });
        //file.close(callback);
    });

    file.on('error', (err) => {
        fs.unlink(filename); 
        progressBar.stop();
        return callback(err.message);
    });
}
    grab(url, 'Lavalink.jar', () => {});
}

// const grab = () => {
//     console.log("Downloading Lavalink.jar")
//     const download = stream(url).pipe(createWriteStream('Lavalink.jar'));
//     download.on("finish", () => {
//         console.log("Finished Downloading Lavalink.jar")
//         execSync("java -jar Lavalink.jar", { stdio: "inherit" });
//     });
// };