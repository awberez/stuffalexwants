const express = require("express"), app = express(), bodyParser = require("body-parser"), PORT = process.env.PORT || 8081;
 
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

require("./routes/gifts-api-routes.js")(app);
 
const server = app.listen(PORT, function(){
    const port = server.address().port;
    console.log("Server started at http://localhost:%s", port);
});