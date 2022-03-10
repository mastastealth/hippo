import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class HeaderComponent extends Component {
  @service supabase;

  @tracked currentStreak = this.supabase.currentStreak;
}
