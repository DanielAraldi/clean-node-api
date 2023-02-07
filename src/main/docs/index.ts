import paths from './paths';
import components from './components';
import schemas from './schemas';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description:
      'API of surveys in NodeJs using Typescript, TDD, Clean Architecture, Design Patterns and SOLID principles.',
    version: '1.4.0',
    termsOfService:
      'https://github.com/DanielAraldi/clean-node-api/blob/main/LICENSE',
    contact: {
      name: 'GitHub Issues',
      url: 'https://github.com/DanielAraldi/clean-node-api/issues',
    },
    license: {
      name: 'MIT License',
      url: 'https://github.com/DanielAraldi/clean-node-api/blob/main/LICENSE',
    },
  },
  servers: [{ url: '/api' }],
  tags: [{ name: 'Login' }, { name: 'Survey' }],
  paths,
  schemas,
  components,
};
