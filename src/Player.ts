import type BeamEndpoint from 'beamio/dist/BeamEndpoint';
import type Party from './Party';

interface PlayerConstructorProps {
  session: string,
  username: string,
  socket: BeamEndpoint,
  party: Party,
}

export default class {
  session: string;

  username: string;

  endpoint: BeamEndpoint;

  party: Party;

  /**
   * Indique si le Player est actif dans le tour actuel.
   *  - Lors d'une déconnexion: `isActive` = `false`.
   *  - A chaque début de tour: `isActive` = `isConnected`.
   * Indifférent si la Party n'a pas commencé (si isOpen === true).
   */
  isActive: boolean = true;

  score: number = 0;

  get isConnected() {
    return this.endpoint.isReady;
  }

  constructor(props: PlayerConstructorProps) {
    this.session = props.session;
    this.username = props.username;
    this.endpoint = props.socket;
    this.party = props.party;
    this.setListeners();
  }

  setListeners() {
    this.party.setPlayerStatus(this, true);

    this.endpoint.on('disconnect', () => {
      this.isActive = false;
      this.party.setPlayerStatus(this, false);
    });
  }

  setEndpoint(newEndpoint: BeamEndpoint) {
    if (this.endpoint && this.isConnected) {
      console.log(`Duplicate player '${this.username}', disconnect first client`);
      this.endpoint.close(4006, 'Le client est ouvert dans un autre onglet');
    }

    this.endpoint = newEndpoint;
    this.setListeners();
  }
}
