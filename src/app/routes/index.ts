import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { UserRoutes } from '../modules/User/user.routes';
import { BiodataRoutes } from '../modules/Biodata/biodata.routes';

const router = Router();

const moduleRoutes = [
  { path: '/auth', route: AuthRoutes },
  { path: '/users', route: UserRoutes },
  { path: '/biodata', route: BiodataRoutes },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
