/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};

const path = require('path');
const fs = require('fs');

let storage = [];

// Handles /classes/messages
const getClassesMessages = (request, response) => {
  let statusCode = 200;

  // See the note below about CORS headers.
  let headers = defaultCorsHeaders;
  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json';

  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(storage));
};

const postClassesMessages = (request, response) => {
  let statusCode = 201;
  let headers = defaultCorsHeaders;
  let data = '';

  headers['Content-Type'] = 'application/json';

  request.on('data', (chunk) => {
    data += chunk;
  });

  request.on('end', () => {
    try {
      const obj = JSON.parse(data);

      if (typeof obj !== 'object') {
        throw new Error();
      }

      storage.push(obj);
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(storage));
    } catch (e) {
      response.writeHead(400, headers);
      response.end(JSON.stringify({
        error: 'Missing body data'
      }));
    }
  });
};

const getClient = (request, response) => {
  const filePath = path.join('..', __dirname, 'chatterbox.html');

  fs.readFile(filePath, function(err, data) {
    const headers = defaultCorsHeaders;

    if (err) {
      headers['Content-Type'] = 'text/plain';
      response.writeHead(500, headers);
      response.end('Failed to read file');
      return;
    }

    res.writeHead(200, headers);
    res.end(data);
  });
};

const requestHandler = function(request, response) {
  if (request.url === '/classes/messages') {
    if (request.method === 'GET' || request.headers['access-control-request-method'] === 'GET') {
      return getClassesMessages(request, response);
    } else if (request.method === 'POST' || request.headers['access-control-request-method'] === 'POST') {
      return postClassesMessages(request, response);
    }
  } else if (request.url === '/client') {
    return getClient(request, response);
  }

  const headers = defaultCorsHeaders;
  headers['Content-Type'] = 'text/plain';

  response.writeHead(404, headers);
  response.end('Not found');

  // // Request and Response come from node's http module.
  // //
  // // They include information about both the incoming request, such as
  // // headers and URL, and about the outgoing response, such as its status
  // // and content.
  // //
  // // Documentation for both request and response can be found in the HTTP section at
  // // http://nodejs.org/documentation/api/

  // // Do some basic logging.
  // //
  // // Adding more logging to your server can be an easy way to get passive
  // // debugging help, but you should always be careful about leaving stray
  // // console.logs in your code.
  // console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // // The outgoing status.
  // var statusCode = 200;

  // // See the note below about CORS headers.
  // var headers = defaultCorsHeaders;

  // // Tell the client we are sending them plain text.
  // //
  // // You will need to change this if you are sending something
  // // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = 'text/plain';

  // // .writeHead() writes to the request line and headers of the response,
  // // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // // Make sure to always call response.end() - Node may not send
  // // anything back to the client until you do. The string you pass to
  // // response.end() will be the body of the response - i.e. what shows
  // // up in the browser.
  // //
  // // Calling .end "flushes" the response's internal buffer, forcing
  // // node to actually send all the data over to the client.
  // response.end('Hello, World!');
};



exports.requestHandler = requestHandler;