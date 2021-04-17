import Component from '@glimmer/component';
import { action } from '@ember/object';
import { trackedReset } from 'tracked-toolbox';

export default class CardComponent extends Component {
  @trackedReset('args.flipMe') flipped = false;

  @action
  flipCard() {
    this.flipped = !this.flipped;
    this.args.toggleSide?.();
  }
}
