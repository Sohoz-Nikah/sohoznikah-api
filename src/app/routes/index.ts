import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { BiodataRoutes } from '../modules/Biodata/biodata.routes';
import { ContactRoutes } from '../modules/Contact/contact.routes';
import { FavouriteRoutes } from '../modules/Favourite/favourite.routes';
import { NotificationRoutes } from '../modules/Notification/notification.routes';
import { ProposalRoutes } from '../modules/Proposal/proposal.routes';
import { ShortlistRoutes } from '../modules/ShortList/shortList.routes';
import { TokenRoutes } from '../modules/Token/token.routes';
import { UserRoutes } from '../modules/User/user.routes';

const router = Router();

const moduleRoutes = [
  { path: '/auth', route: AuthRoutes },
  { path: '/users', route: UserRoutes },
  { path: '/biodata', route: BiodataRoutes },
  { path: '/notification', route: NotificationRoutes },
  { path: '/favourite', route: FavouriteRoutes },
  { path: '/shortlist', route: ShortlistRoutes },
  { path: '/token', route: TokenRoutes },
  { path: '/proposals', route: ProposalRoutes },
  { path: '/contacts', route: ContactRoutes },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
