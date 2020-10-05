const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');


// http.createServer((request, response) => {
// 	//解析请求，包括文件名
// 	let pathname = url.parse(request.url).pathname;
// 	//输出请求的文件名
// 	console.log("Request for " + pathname + "  received.");
// 	//当请求static文件夹时，设置文件返回类型是text/css
// 	var firstDir = pathname && pathname.split('/')[2];
// 	var ContentType = null;
// 	if (firstDir && firstDir === 'static') {
// 		ContentType = { 'Content-Type': 'text/css' };
// 	} else {
// 		ContentType = { 'Content-Type': 'text/html' }
// 	}

// 	//从文件系统中去请求的文件内容
// 	fs.readFile(pathname.substr(1), function (err, data) {
// 		if (err) {
// 			console.log(err);
// 			//HTTP 状态码 404 ： NOT FOUND
// 			//Content Type:text/plain
// 			response.writeHead(404, { 'Content-Type': 'text/html' });
// 		}
// 		else {
// 			//HTTP 状态码 200 ： OK
// 			//Content Type:text/plain
// 			response.writeHead(200, ContentType);

// 			//写会回相应内容
// 			response.write(data.toString());
// 		}
// 		//发送响应数据
// 		response.end();
// 	});
// }).listen(8081);

// console.log('Server running at http://127.0.0.1:8081/');



http.createServer(function (request, response) {
	let uri = url.parse(request.url).pathname;
	console.log("Request for " + uri + "  received.");
	let filename = path.join(__dirname, uri);

	var extname = path.extname(filename);
	var contentType = "text/html";
	switch (extname) {
		case ".js":
			contentType = "text/javascript";
			break;
		case ".css":
			contentType = "text/css";
			break;
		case ".ico":
			contentType = "image/x-icon";
			break;
		case ".svg":
			contentType = "image/svg+xml";
			break;
	}

	fs.exists(filename, function (exists) {
		if (!exists) {
			response.writeHead(404, { "Content-Type": "text/plain" });
			response.write("404 Not Found\n");
			response.end();
			return;
		}

		if (fs.statSync(filename).isDirectory()) filename += "/index.html";

		fs.readFile(filename, "binary", function (err, file) {
			if (err) {
				response.writeHead(500, { "Content-Type": "text/plain" });
				response.write(err + "\n");
				response.end();
				return;
			}
			response.writeHead(200, { "Content-Type": contentType });
			response.write(file, "binary");
			response.end();
		});
	});
})
	.listen(9999);

console.log('Server is running on http://localhost:' + '9999');