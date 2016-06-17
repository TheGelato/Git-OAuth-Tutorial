var express = require('express');
var app = express();
// var domain = "http://localhost:8000"
var request = require('request');
var session = require('express-session');
var domain = "https://git-oauth.herokuapp.com"
var oauth ={ client_id: 'f5fab340aebab3b77bcd', client_secret:'8d328feaf12b566c1ef76ffd1991d35ed5ab2639', redirect_uri: domain+"/redirect"}
var url = 'https://github.com/login/oauth/authorize?client_id='+oauth.client_id+'&redirect_uri='+oauth.redirect_uri
var redirect_url = domain+"/redirect"
var port = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));
app.use(session({secret: 'ssshhhhh'}));

app.get('/', function(req, res) {
    res.render('index',{url:url});
});

app.get('/redirect', function(req, res) {
    code = req.query.code
    headers = { 'Accept': 'application/json','User-Agent': 'User Agaent'}
    form = { client_id: oauth.client_id,client_secret:oauth.client_secret,code:code,redirect_uri:redirect_url }
    urltoken = 'https://github.com/login/oauth/access_token'
    request.post(
        { url:urltoken, form: form ,headers : headers},
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body)
                req.session.token= body.access_token;
                res.redirect('/repos')

            }
        }
    );
});

app.get('/repos', function(req, res) {
    headers = {'User-Agent': 'User Agent'}
    request.get(
        {url:'https://api.github.com/user/repos?access_token='+req.session.token,headers:headers},
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                data = JSON.parse(body)
                res.render('repos',{data:data});
            }
        }
    );
});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
