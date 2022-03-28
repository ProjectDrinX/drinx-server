import type BeamEndpoint from 'beamio/src/BeamEndpoint';

export default class {
  /** L'identifiant de session permet  */
  session: string;

  name: string;

  endpoint: BeamEndpoint;

  constructor(session: string, name: string, socket: BeamEndpoint) {
    this.session = session;
    this.name = name;
    this.endpoint = socket;
  }
}
