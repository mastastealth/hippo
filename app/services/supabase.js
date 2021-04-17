import Service from '@ember/service';
import { createClient } from '@supabase/supabase-js';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

import dayjs from 'dayjs';
import ENV from "hippo/config/environment";

export default class SupabaseService extends Service {
  @service notifications;

  init() {
    super.init(...arguments);

    const supabaseUrl = ENV.SUPA_URL;
    const supabaseKey = ENV.SUPA_KEY;
    
    try {
      const supa = createClient(supabaseUrl, supabaseKey);
      this.client = supa;
      this.auth = supa.auth;
      supa.auth.onAuthStateChange(this.authChange);
    } catch(e) {
      console.error(e);
    }
  }

  @tracked cards;
  @tracked user;
  @tracked sess;
  @tracked startDate;

  @action
  async getCards() {
    if (!this.startDate) {
      // Get the first? card for a given user
      const { data } = await this.client.from('cards').select('id').order('id', { ascending: true }).limit(1);
      if (data.length) this.startDate = data?.[0].id;
    }
   
    // Fetch all the cards for the day, i.e. anything with a due date of today or older
    this.cards = await this.client
                           .from('cards').select()
                           .lte('dueDate', dayjs().endOf('day').valueOf())
                           .order('level', { ascending: false });

    return this.cards;
  }

  @action
  async getUser() {
    this.user = await this.auth.user();
    this.sess = await this.auth.session();
    console.info('User session initiated.');
  }

  @action
  async addCard(card) {
    const { error } = await this.client.from('cards').insert([
      { ...card }
    ]);

    if (!error) {
      this.notifications.success('Saved the card!', { autoClear: true });
      return true;
    } else {
      this.notifications.error(error.message, { autoClear: true });
      return false;
    }
  }

  @action
  signOut() {
    this.notifications.info('Logged out.', { autoClear: true });
    this.auth.signOut();
  }

  @action
  authChange(e, sess) {
    if (!this.sess) {
      this.getUser();
      this.getCards();
    }

    this.sess = sess;
  }
}
