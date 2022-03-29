import type * as Schemes from 'drinx-schemes';
import Player from './Player';

export default class {
  id: string;

  players: Player[] = [];

  isOpen: boolean = true;

  get owner() {
    return this.players[0];
  }

  constructor(id: string) {
    this.id = id;
    console.log('New party created:', this.id);
  }

  getPlayer(value: string, key: 'session' | 'username'): Player | undefined {
    return this.players.find((p) => p[key] === value);
  }

  addPlayer(player: Player) {
    // On ajoute le Player à la Party
    this.players.push(player);

    // On broadcast le nouveau Player
    for (const p of this.players) {
      p.endpoint.emit('addPlayer', {
        username: player.username,
      } as typeof Schemes.addPlayer);
    }

    console.log(`Player '${player.username}' added to party ${this.id}`);
  }

  setPlayerStatus(player: Player, status: boolean) {
    // Si le client s'est déconnecté et que la Party est ouverte
    if (!status && this.isOpen) {
      // On le retire de la Party
      this.players = this.players.filter((p) => p !== player);

      // On broadcast l'évennement
      for (const p of this.players) {
        p.endpoint.emit('removePlayer', {
          username: player.username,
        } as typeof Schemes.removePlayer);
      }

      console.log(`Player '${player.username}' removed from party ${this.id}`);
      return;
    }

    // Sinon, on broadcast le status du Player
    for (const p of this.players) {
      p.endpoint.emit('setPlayerStatus', {
        username: player.username,
        status,
      } as typeof Schemes.setPlayerStatus);
    }

    console.log(`Player '${player.username}' is now: ${status ? 'Online' : 'Offline'}`);
  }
}
