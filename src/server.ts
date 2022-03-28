import BeamServer from 'beamio/Server';
import * as Schemes from 'drinx-schemes';

export default new BeamServer(Schemes, {
  port: 5310,
});
