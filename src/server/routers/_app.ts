/**
 * This file contains the root router of your tRPC-backend
 */
 import { router } from '../trpc';
import { addressRouter } from './address';
import { departmentRouter } from './department';
import { equipmentRouter } from './equipment';
import { equipmenttypeRouter } from './equipmenttype';
import { instrumentfunctionRouter } from './instrumentfunction';
import { instrumenttypeRouter } from './instrumenttype';
import { measuredVariableRouter } from './measuredvariable';
import { siteRouter } from './site';

 export const appRouter = router({

   measuredvariable: measuredVariableRouter,
   instrumentfunction: instrumentfunctionRouter,
   instrument: instrumenttypeRouter,
   department: departmentRouter,
   site: siteRouter,
   equipment: equipmentRouter,
   equipmenttype: equipmenttypeRouter,
   address: addressRouter,
 });

 export type AppRouter = typeof appRouter;