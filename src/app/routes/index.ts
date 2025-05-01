import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { UserRoutes } from '../modules/User/user.routes';
import { BiodataRoutes } from '../modules/Biodata/biodata.routes';
import { NotificationRoutes } from '../modules/Notification/notification.routes';
import { FavouriteRoutes } from '../modules/Favourite/favourite.routes';
import { ShortlistRoutes } from '../modules/ShortList/shortList.routes';

const router = Router();

const moduleRoutes = [
  { path: '/auth', route: AuthRoutes },
  { path: '/users', route: UserRoutes },
  { path: '/biodata', route: BiodataRoutes },
  { path: '/notification', route: NotificationRoutes },
  { path: '/favourite', route: FavouriteRoutes },
  { path: '/shortlist', route: ShortlistRoutes },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
