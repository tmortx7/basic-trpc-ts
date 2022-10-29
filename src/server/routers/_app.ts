/**
 * This file contains the root router of your tRPC-backend
 */
 import { router } from '../trpc';
import { instrumentfunctionRouter } from './instrumentfunction';
import { instrumentisaRouter } from './instrumentisa';
import { measuredVariableRouter } from './measuredvariable';

 export const appRouter = router({

   measuredvariable: measuredVariableRouter,
   instrumentfunction: instrumentfunctionRouter,
   instrument: instrumentisaRouter
 });

 export type AppRouter = typeof appRouter;