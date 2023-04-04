import { UnAuthenticatedError } from '../errors/index.js';

const checkPermissions = (requestUser, resourceUserId) => {
// if (requestUser.role === 'admin') return - this is how you would handle an admin role
//  resourceUserId is an object so we need to convert to string
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new UnAuthenticatedError('Not authorized to access this route');
};

export default checkPermissions;