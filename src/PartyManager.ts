import Party from './Party';
import { genUID } from './utils';

const parties: { [pID: string]: Party } = {};

export default {
  createParty(): Party {
    // On génère un identifiant de partie
    const partyID = genUID();
    // Si une partie avec cet identifiant existe déjà, on recommence
    if (parties[partyID]) return this.createParty();

    // On crée une nouvelle partie
    parties[partyID] = new Party(partyID);

    return parties[partyID];
  },

  partyExists(partyID: string): boolean {
    return !!parties[partyID];
  },

  getParty(partyID: string): Party | undefined {
    return parties[partyID];
  },
};
