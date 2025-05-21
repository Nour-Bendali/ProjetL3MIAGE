// imports
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';     
import express from 'express';         // Framework HTTP  Node.js
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';


const serverDistFolder = dirname(fileURLToPath(import.meta.url)); 
const browserDistFolder = resolve(serverDistFolder, '../browser');  

const app = express();
const angularApp = new AngularNodeAppEngine();


app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',    
    index: false,    
    redirect: false, 
  }),
);

// Gestions de routes
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

// démarrage serveur

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
