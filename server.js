// Load required modules (and then we refer to them by these variables)
var http = require('http');
var fs = require('fs');
var ejs = require('ejs');
var request = require('request');

// Read the template from disk (and then we refer to it by this variable)
var view = fs.readFileSync(__dirname + '/view.ejs.html', 'utf8');

// Start our HTTP server (and then this function is called for every request)
http.createServer(function(req, res) {

    // req is the request
    // res will be the response

    // Send the HTTP header to the browser
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });

    // Figure out what word to look up
    var word = req.url.split('/')[1];
    var antonym;

    // http://words.bighugelabs.com/api/2/7e602ef8a2845f4e63ad6e90fa958ec5/yes/json
    request('http://words.bighugelabs.com/api/2/7e602ef8a2845f4e63ad6e90fa958ec5/' + word + '/json',

    function(error, response, body) {

        if (!error && response.statusCode == 200) {
            var definition = JSON.parse(body);


            Object.keys(definition).forEach(function(partOfSpeech) {
                if (definition[partOfSpeech].ant && !antonym) {
                    antonym = definition[partOfSpeech].ant[0];
                }
            });

            console.log(word);
            console.log(antonym);
        }

        request('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=919a77af51a155866700ea285de18eef&tags=' + antonym + '&per_page=1&format=json&nojsoncallback=1',

        function(error, response, body) {

            var photosearch = JSON.parse(body);

            // console.log('photosearch: ', body);

            var farm = photosearch.photos.photo[0].farm;
            var server = photosearch.photos.photo[0].server;
            var id = photosearch.photos.photo[0].id;
            var secret = photosearch.photos.photo[0].secret;

            // console.log(farm);
            // console.log(server);
            console.log(id);
            // console.log(secret);

            res.write(ejs.render(view, {
                locals: {
                    farm: farm,
                    server: server,
                    secret: secret,
                    id: id,
                    word: word,

                }


            }));
            res.end();
        });

    });


}).listen(process.env.PORT);
