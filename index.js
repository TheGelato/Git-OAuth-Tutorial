var express = require('express');
var app = express();
var oauth ={ client_id: 'f5fab340aebab3b77bcd', redirect_uri: "https://git-oauth.herokuapp.com/repos"}
var url = 'https://github.com/login/oauth/authorize?client_id='+oauth.client_id+'&redirect_uri='+oauth.redirect_uri
var port = process.env.PORT || 80;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res) {
    res.render('index',{url:url});
});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
