import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CreateController extends Controller {
  @service notifications;
  @service supabase;

  @tracked front;
  @tracked frontText;
  @tracked back;
  @tracked backText;
  @tracked side = 0;

  get card() {
    return [this.front, this.back];
  }

  get currentSide() {
    return this.card[this.side];
  }

  @action 
  toggleSide() {
    this.side = this.side ? 0 : 1;
  }

  @action
  registerCard(sdb, back = false) {
    if (back) {
      this.back = sdb;
    } else {
      this.front = sdb;
    }
  }

  @action
  changeColor(c) {
    this.front.setLineColor(c.target.value);
    this.back.setLineColor(c.target.value);
  }

  @action
  async undo() {
    await this.currentSide.undo();
  }

  @action
  saveCard() {
    try {
      this.supabase.addCard({
        id: Date.now(),
        frontText: this.frontText,
        frontImg: this.card[0].toDataURL(),
        backText: this.backText,
        backImg: this.card[1].toDataURL(),
        uid: this.supabase.user.id
      });
      this.clearCard();
      this.notifications.success('Saved the card!', { autoClear: true });
    } catch (error) {
      this.notifications.error(error);
    }
  }

  @action
  clearCard() {
    this.frontText = '';
    this.backText = '';
    this.card[0].clear();
    this.card[1].clear();
  }
}
