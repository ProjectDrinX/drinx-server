import type * as Schemes from 'drinx-schemes';
import type Party from './Party';
import PartyManager from './PartyManager';
import Player from './Player';
import BS from './server';
import { genUID, isUID, isUsername } from './utils';

console.log(`Service started on ${new Date().toLocaleString()}`);

BS.on('connect', (client) => {
  let initialised = false;

  // Lorsque le client se connecte
  client.on('initClient', (data: typeof Schemes.initClient) => {
    // Si le client a déjà été initialisé, on annule
    if (initialised) return;
    initialised = true;

    // Si un SessionID invalide est fourni, on envoie une erreur
    if (data.session && !isUID(data.session)) {
      console.error('Invalid \'initClient\' data:', data);
      client.close(4001, 'Invalid initialisation data');
      return;
    }

    // Si un Username invalide est fourni, on envoie une erreur
    if (data.username && !isUsername(data.username)) {
      console.error('Invalid \'initClient\' data:', data);
      client.close(4001, 'Invalid initialisation data');
      return;
    }

    // (Rejoindre après déconnexion) Si le client envoie un PartyID et un SessionID
    if (data.party && data.session) {
      // Si la Party n'existe pas, on envoie une erreur
      if (!PartyManager.partyExists(data.party)) {
        client.close(4004, 'Cette partie est terminée ou n\'existe pas.');
        return;
      }

      // Sinon, on récupère le Player pour actualiser son endpoint
      const party = PartyManager.getParty(data.party) as Party;
      const player = party.getPlayer(data.session, 'session');

      // Si l'utilisateur n'existe pas dans la Party, on envoie une erreur
      if (!player) {
        client.close(4004, 'Cette partie est terminée ou n\'existe pas.');
        return;
      }

      // Sinon, on actulise l'endpoint du client
      player.setEndpoint(client);

      // On envoie le Username au client
      client.emit('initClient', { username: player.username } as typeof Schemes.initClient);
      return;
    }

    // (Rejoindre) Si le client envoie un PartyID et un Username
    if (data.party && data.username) {
      // On essaie de l'ajouter à la Party
      const party = PartyManager.getParty(data.party);

      // Si la Party n'existe pas, on envoie une erreur
      if (!party) {
        client.close(4004, 'Cette partie est terminée ou n\'existe pas.');
        return;
      }

      // Si la Party n'est pas ouverte, on envoie une erreur
      if (!party.isOpen) {
        client.close(4005, 'Cette partie a commencé et n\'est plus rejoignable');
        return;
      }

      // Si un Player existe déjà avec le même Username, on envoie une erreur
      if (party.getPlayer(data.username, 'username')) {
        client.close(4003, 'Ce nom d\'utilisateur est déjà pris');
        return;
      }

      // Sinon, on crée le Player
      const player = new Player({
        username: data.username,
        session: genUID(),
        socket: client,
        party,
      });

      // On l'ajoute à la Party
      party.addPlayer(player);

      // On envoie le SessionID au client
      client.emit('initClient', { session: player.session } as typeof Schemes.initClient);
      return;
    }

    // (Création) Si seul un Username a été fourni par le client
    if (data.username) {
      // On crée une nouvelle Party
      const party = PartyManager.createParty();

      // On crée le Player
      const player = new Player({
        username: data.username,
        session: genUID(),
        socket: client,
        party,
      });

      // On l'ajoute à la Party
      party.addPlayer(player);

      // On envoie le PartyID et le SessionID au client
      client.emit('initClient', {
        party: party.id,
        session: player.session,
      } as typeof Schemes.initClient);
      return;
    }

    console.error('Invalid \'initClient\' data:', data);
    client.close(4001, 'Invalid initialisation data');
  });
});
