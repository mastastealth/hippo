import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { alias } from '@ember/object/computed';
import dayjs from 'dayjs';

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

  get levels() {
    const day =
      dayjs()
        .endOf('day')
        .diff(dayjs(this.supabase.startDate).startOf('day'), 'day') + 1;

    return {
      1: true,
      2: !!(day % 2),
      3: !((day - 2) % 4),
      4: !((day - 4) % 8),
      5: !((day - 8) % 16),
      6: !((day - 16) % 32),
      7: !((day - 32) % 64),
    };
  }

  calcNewDue(card, newLevel) {
    if (newLevel === 1) {
      return card.dueDate;
    } else {
      const start = dayjs(this.supabase.startDate);
      const now = dayjs();
      const day = now.endOf('day').diff(start.startOf('day'), 'day') + 1;
      let gap;

      switch (newLevel) {
        case 2:
          return dayjs()
            .add((day % 2) + 1, 'day')
            .startOf()
            .valueOf();
        case 3:
          gap = (day - 2) % 4;
          return dayjs()
            .add(gap ? 4 - gap : 4, 'day')
            .startOf()
            .valueOf();
        case 4:
          gap = (day - 4) % 8;
          return dayjs()
            .add(gap ? 8 - gap : 8, 'day')
            .startOf()
            .valueOf();
        case 5:
          gap = (day - 8) % 16;
          return dayjs()
            .add(gap ? 16 - gap : 16, 'day')
            .startOf()
            .valueOf();
        case 6:
          gap = (day - 16) % 32;
          return dayjs()
            .add(gap ? 32 - gap : 32, 'day')
            .startOf()
            .valueOf();
        case 7:
          gap = (day - 32) % 64;
          return dayjs()
            .add(gap ? 64 - gap : 64, 'day')
            .startOf()
            .valueOf();
      }
    }
  }

  @action
  async gotIt(yes) {
    const card = this.currentCard;

    if (yes && card.level < 7) {
      const { error } = await this.supabase.client
        .from('cards')
        .update({
          level: yes ? card.level + 1 : 1,
          dueDate: this.calcNewDue(card, yes ? card.level + 1 : 1),
        })
        .match({ id: card.id });

      if (error) console.error(error);
      console.info(dayjs(this.calcNewDue(card, yes ? card.level + 1 : 1)));
    } else {
      // TODO - Delete card and celebrate new long term memory
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
    later(
      this,
      function () {
        // Grab top of deck
        const top = this.cardQueue.shift();
        // Put it at bottom if we didn't memorize it yet
        if (!yes) this.cardQueue.push(top);
        // If we're down to 1 card, add the custom "last"
        if (this.cardQueue.length === 1 && this.cardQueue[0].id)
          this.cardQueue.push({
            id: 0,
            frontText: `Almost there. ${this.cardQueue.length} more cards to go...`,
          });

        // Update array properly now
        this.cardQueue = [...this.cardQueue];

        this.swapping = !this.swapping;
      },
      1000
    );
  }
}
