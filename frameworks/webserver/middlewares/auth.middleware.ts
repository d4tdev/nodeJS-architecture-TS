'use strict';

import JWT from 'jsonwebtoken';
import keyTokenDbRepo from '../../../application/repositories/IKeyTokenDb.repo';
import keyTokenDbRepoImpl from '../../database/mongodb/repositories/keyTokenDb.repo';
import { Api401Error, Api404Error } from './error.response';
import { Headers } from '../utils';
import { NextFunction, Response } from 'express';
import { IRequest } from '../../../config/interfaces/express.interface';

const keyTokenDb = keyTokenDbRepo(keyTokenDbRepoImpl());
export default function authMiddleware() {
   const authentication = async (
      req: IRequest,
      res: Response,
      next: NextFunction
   ) => {
      /**
       * 1. Check userId missing?
       * 2. Get access token
       * 3. Verify token
       * 4. Check user in DB
       * 5. Check keyStore with userId
       * 6. Return next()
       */

      const userId = req.headers[Headers.CLIENT_ID];
      if (!userId) throw new Api401Error('Invalid Request');

      // 2.
      const keyStore = await keyTokenDb.findByUserId(userId);
      if (!keyStore) throw new Api404Error('Not Found keyStore');

      // 3.
      const accessToken = req.headers[Headers.AUTHORIZATION];
      if (!accessToken) throw new Api401Error('Invalid Request');

      try {
         const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
         if (userId !== decodeUser.userId)
            throw new Api401Error('Invalid UserId');
         req.keyStore = keyStore;
         next();
      } catch (err) {
         return err;
      }
   };

   return { authentication };
}
