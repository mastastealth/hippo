import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CardComponent extends Component {
  @tracked flipped = false;

  @action
  flipCard() {
    this.flipped = !this.flipped;
  }
}
