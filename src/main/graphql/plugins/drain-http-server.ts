import { Express } from 'express';
import { ApolloServerPlugin } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';

export const pluginDrainHttpServer = (app: Express): ApolloServerPlugin => {
  const httpServer = http.createServer(app);
  return ApolloServerPluginDrainHttpServer({ httpServer });
};
