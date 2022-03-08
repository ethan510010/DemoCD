var http = require("http");
var createHandler = require("github-webhook-handler");
var handler = createHandler({ path: "/", secret: "root" });
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

http
  .createServer(function (req, res) {
    handler(req, res, function (err) {
      res.statusCode = 404;
      res.end("no such location");
    });
  })
  .listen(8000);

handler.on("error", function (err) {
  console.error("Error:", err.message);
});
// 偵測到github push 事件後要做的事
handler.on("push", async function (event) {
  console.log(
    "Received a push event for %s to %s",
    event.payload.repository.name,
    event.payload.ref
  );
  console.log(await exec('echo "start pulling data"'));
  await exec(`git checkout master`);
  console.log("git checkout的結果", checkoutResult);
  await exec(`git pull origin master`);
  console.log("git pull的結果", checkoutResult);
  await exec("pm2 restart DemoCD");
});
