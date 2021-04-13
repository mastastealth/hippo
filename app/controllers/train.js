import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { alias } from '@ember/object/computed';

export default class TrainController extends Controller {
  @service supabase;

  @tracked swapping = false;
  @alias('model') cardQueue;

  get currentCard() {
    return this.cardQueue?.[0];
  }

  get nextCard() {
    return this.cardQueue?.[1];
  }

  get noCardsLeft() {
    return !(this.cardQueue.length > 1 && !this.swapping);
  }

  @action
  async gotIt(yes) {
    const card = this.currentCard;

    try {
      if (card.id) await this.supabase.client.from('cards').update({ 
        level: yes ? card.level + 1 : 1 
      }).match({ id: card.id });
    } catch(e) {
      console.error(e);
    }

    this.swapCards(yes);
  }

  @action
  swapCards(yes) {
    // Check if we memorized final card
    if (yes && !this.cardQueue[1].id) {
      this.cardQueue[1].frontText = 'All done!';
      this.cardQueue = [...this.cardQueue];
    }

    // Start animation
    this.swapping = !this.swapping;

    // When animation is done...
    later(this, function() {
      // Grab top of deck
      const top = this.cardQueue.shift();
      // Put it at bottom if we didn't memorize it yet
      if (!yes) this.cardQueue.push(top);
      // If we're down to 1 card, add the custom "last"
      if (this.cardQueue.length === 1 && this.cardQueue[0].id) 
        this.cardQueue.push({ 
          id: 0, 
          frontText: `Almost there. ${this.cardQueue.length} more cards to go...` 
        });

      // Update array properly now
      this.cardQueue = [...this.cardQueue];

      this.swapping = !this.swapping;
    }, 1000)
  }
}
