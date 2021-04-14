import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

import dayjs from 'dayjs';

export default class HeaderComponent extends Component {
  @service supabase;

  currentDay = dayjs().endOf('day').diff(dayjs(this.supabase.startDate).startOf('day'), 'day') + 1;
}

