// Initializes the `email` service on path `/email`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Email } from './email.class';
import hooks from './email.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'email': Email & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/email', new Email(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('email');

  service.hooks(hooks);
}
