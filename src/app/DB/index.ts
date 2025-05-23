/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../config';
import { hashedPassword } from '../helper/hashPasswordHelper';
import prisma from '../shared/prisma';

const seedSuperAdmin = async () => {
  try {
    // Hash the password
    const newPass: string = await hashedPassword(
      config.super_admin.pass as string,
    );

    const superUser = {
      name: config.super_admin.name as string,
      email: config.super_admin.email as string,
      emailConfirmed: true,
      phoneNumber: config.super_admin.phoneNumber as string,
      passwordHash: newPass,
      role: 'SUPER_ADMIN' as const,
      status: 'ACTIVE' as const,
      isDeleted: false,
    };

    // Check if a super admin already exists
    const isSuperAdminExists = await prisma.user.findUnique({
      where: { email: config.super_admin.email },
    });

    if (!isSuperAdminExists) {
      // Create super admin if not found
      await prisma.user.create({ data: superUser });

      console.log(`✅  Super admin created successfully!`);
    } else {
      console.log(`ℹ️  Super admin already exists.`);
    }
  } catch (error: any) {
    console.error(`❌  Error seeding super admin:`, error.message || error);
  }
};

export default seedSuperAdmin;
