import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class HeaderComponent extends Component {
  @service supabase;

  get currentStreak() {
    return this.supabase.currentStreak;
  }
}
