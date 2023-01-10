import paths from './paths';
import components from './components';
import schemas from './schemas';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description:
      'API of surveys in NodeJs using Typescript, TDD, Clean Architecture, Design Patterns and SOLID principles.',
    version: '1.2.1',
  },
  contact: {
    name: 'Daniel Sansão Araldi',
    url: 'https://github.com/DanielAraldi/clean-node-api/issues',
  },
  license: {
    name: 'MIT',
    url: 'https://github.com/DanielAraldi/clean-node-api/blob/main/LICENSE',
  },
  servers: [{ url: '/api' }],
  tags: [{ name: 'Login' }, { name: 'Survey' }],
  paths,
  schemas,
  components,
};
