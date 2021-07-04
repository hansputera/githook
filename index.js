const http = require("http");
const util = require("./util");
const { CHAT_FORMAT } = require("./config");

const server = http.createServer((req, res) => {
    util.log(`Incoming request, route: "${req.url}" - "${req.headers["user-agent"]}"`);
    if (!/Github-Hookshot\/[a-zA-Z0-9]/gi.test(req.headers["user-agent"])) return res.end("This is not from GitHub!");
    util.log("Request detected as Github Webhook");
    let data;
    req.on("data", (chunk) => {
        data = Buffer.from(chunk).toString("utf-8");
    });
    res.writeHead(200, {
        "X-Powered-By": "GitHook",
        "Content-Type": "application/json"
    });
    if (req.method.toLowerCase() != "post") return res.end("Invalid method");
    
    req.on("end", () => {
        try {
            const d = JSON.parse(data);
            if (d.zen) { // notifikasi ping github
                util.sendTG("sendMessage", {
                    "chat_id": CHAT_FORMAT,
                    "text": "Webhook ping received"
                });
                res.end("Webhook correct check");
            } else {
                util.log(`Webhook update received from repository ${d.repository.name}`);
                if (d.commits) {
                    const commitsText = d.commits.map(commit => `[${commit.id.replace(commit.id.slice(commit.id.length - (commit.id.length - 10)), "")}](${commit.url}) - ${commit.message} at ${new Date(commit.timestamp).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })} | commited by ${commit.author.username}`);
                    util.sendTG("sendMessage", {
                        "chat_id": CHAT_FORMAT,
                        "text": commitsText.join("\n"),
                        "parse_mode": "Markdown"
                    });
                }
                if (d.forkee) {
                    util.log(`Forking repository detected to ${d.sender.login}`);
                    util.sendTG("sendMessage", {
                        "chat_id": CHAT_FORMAT,
                        "text": `Repository [${d.repository.full_name}](${d.repository.html_url}) forked, [${d.forkee.full_name}](${d.forkee.html_url})`,
                        "parse_mode": "Markdown"
                    });
                }
                switch (d.action) {
                    case "started":
                        util.log(`Repository ${d.repository.full_name} starred by ${d.sender.login}`);
                        util.sendTG("sendMessage", {
                            text: `Repository [${d.repository.full_name}](${d.repository.html_url}) starred by ${d.sender.login}`,
                            parse_mode: "Markdown",
                            chat_id: CHAT_FORMAT
                        });
                }

                res.end("Webhook received");
            }
        } catch (error) {
            console.error("Maybe this request not from github:", error);
        }
    });
});


server.listen(5000, "0.0.0.0", () => {
    console.log(`Server listening to ${server.address().port}`);
});;