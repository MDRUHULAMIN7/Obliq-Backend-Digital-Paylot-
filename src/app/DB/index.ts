import config from '../config/index.js';
import { USER_ROLE } from '../modules/user/user.constant.js';
import { User } from '../modules/user/user.model.js';
import { PERMISSIONS } from '../constants/permissions.js';

const superUser = {
  name: 'Admin',
  email: 'admin@obliq.local',
  password: config.super_admin_password,
  role: USER_ROLE.admin,
  status: 'active',
  permissions: [...PERMISSIONS],
};

const seedSuperAdmin = async () => {
  if (!config.super_admin_password) {
    throw new Error('SUPER_ADMIN_PASSWORD is required to seed admin.');
  }

  //when database is connected, we will check is there any user who is super admin
  const isAdminExists = await User.findOne({ role: USER_ROLE.admin });

  if (!isAdminExists) {
    await User.create(superUser);
  }
};

export default seedSuperAdmin;
