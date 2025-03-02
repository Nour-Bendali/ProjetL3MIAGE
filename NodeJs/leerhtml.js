var http = require('http');      //Importar modulo http
var fs = require('fs');          //Importar modulo ls          
http.createServer(function (req, res) { // req = solicitud cliente | res = respuesta server 
  fs.readFile('demofile1.html', function(err, data) { // param1 = lee el archivo | param2 =  funcion que dara err contendrá información sobre el problema. 🔹 data contendrá el contenido del archivo si la lectura es exitosa.
    res.writeHead(200, {'Content-Type': 'text/html'}); // Envia codigo de estado Http y un header indicando el tipo de respuesta
    res.write(data); // escribe el contenido en la respuesta
    return res.end(); // finaliza la respuesta y envia datos al cliente
  });
}).listen(8080);  // escucha en el puerto 8080