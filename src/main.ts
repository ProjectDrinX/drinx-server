import type * as Schemes from 'drinx-schemes';
import BS from './server';
import { genUID, isUID } from './utils';

console.log(`Service started on ${new Date().toLocaleString()}`);

BS.on('connect', (client) => {
  let sessionID = '';

  // Lorsque le client se connecte, il est sensé envoyer son sessionID (même s'il est vide)
  client.on('initClient', (data: typeof Schemes.initClient) => {
    // S'il est vide ou invalide, on en génère un nouveau
    if (!isUID(data.session)) {
      sessionID = genUID();
      // Et on l'envoie au client
      client.emit('initClient', { session: sessionID } as typeof Schemes.initClient);
      // return;
    }
  });
});
