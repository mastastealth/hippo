import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class TrainRoute extends Route {
  @service supabase;

  async model() {
    const cards = await this.supabase.getCards();
    const cardQueue = [];

    // Create new array of card data from supa db
    if (cards.data?.length) {
      cards.data.map((c) => {
        cardQueue.push({ ...c });
      });

      if (cardQueue.length === 1) {
        cardQueue.push({
          id: 0,
          frontText: `Almost there. ${cardQueue.length} more cards to go...`,
        });
      } else {
        // TODO - Shuffle all cards? but each level goes from highest to lowest
      }
    } else {
      cardQueue.push({
        id: 0,
        frontText: `No more cards for today.`,
      });
    }

    return cardQueue;
  }

  resetController(controller) {
    controller.set('_cardQueue', null);
  }
}
