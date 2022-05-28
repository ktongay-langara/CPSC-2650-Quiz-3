import feathers from '@feathersjs/client';
import rest from '@feathersjs/rest-client';

const client = feathers();

const restClient = rest();

client.configure(restClient.fetch(window.fetch));

export default client;
