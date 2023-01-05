import paths from './paths';
import components from './components';
import schemas from './schemas';

export default {
  openapi: '3.0.0', // Swagger API version
  info: {
    title: 'Clean Node API',
    description:
      'API of surveys in NodeJs using Typescript, TDD, Clean Architecture, Design Patterns and SOLID principles.',
    version: '1.1.0', // Documentation version
  },
  contact: {
    name: 'Daniel Sansão Araldi',
    url: 'https://github.com/DanielAraldi/clean-node-api/issues',
  },
  license: {
    name: 'MIT',
    url: 'https://github.com/DanielAraldi/clean-node-api/blob/main/LICENSE',
  },
  servers: [{ url: '/api' }], // Paths URL
  tags: [{ name: 'Login' }, { name: 'Survey' }], // Query titles
  paths,
  schemas,
  components,
};
