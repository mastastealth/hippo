import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class TrainRoute extends Route {
  @service supabase;

  async model() {
    const cards = await this.supabase.getCards();
    const cardQueue = [];

    // Create new array of card data from supa db
    cards.data.map(c => {
      cardQueue.push({...c});
    });

    if (cardQueue.length === 1) {
      cardQueue.push({ 
        id: 0, 
        frontText: `Almost there. ${cardQueue.length} more cards to go...` 
      });
    } else {
      // TODO - Shuffle all cards
    }

    return cardQueue;
  }
}
