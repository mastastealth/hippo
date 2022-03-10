import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class LoginController extends Controller {
  @service supabase;
  @service notifications;
  @service router;

  @action
  async login(e) {
    e.preventDefault();

    const { error } = await this.supabase.auth.signIn({
      email: e.target[0].value,
      password: e.target[1].value,
    });

    if (error) {
      this.notifications.error(error.message, { autoClear: true });
    } else {
      this.notifications.success('Welcome back!', { autoClear: true });
      this.router.transitionTo('index');
    }
  }
}
