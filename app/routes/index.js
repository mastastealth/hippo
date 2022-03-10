import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service supabase;

  async model() {
    const user = await this.supabase.client.auth.user();

    return {
      user,
      supa: this.supabase,
    };
  }
}
