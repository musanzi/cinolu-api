import { hash } from 'bcryptjs';
import dataSource from '../orm.config';
import { Roles } from '../../auth/enums';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/entities/user.entity';
import { config } from 'dotenv';

config({
  path: '.env'
});

const seedUsers = [
  {
    email: process.env.ADMIN_EMAIL,
    name: 'Admin',
    password: process.env.ADMIN_PASSWORD,
    role: Roles.STAFF
  }
];

async function seed(): Promise<void> {
  await dataSource.initialize();

  try {
    const roleRepository = dataSource.getRepository(Role);
    const userRepository = dataSource.getRepository(User);

    const roles = new Map<Roles, Role>();

    for (const roleName of Object.values(Roles)) {
      let role = await roleRepository.findOne({ where: { name: roleName } });

      if (!role) {
        role = roleRepository.create({ name: roleName });
        role = await roleRepository.save(role);
      }

      roles.set(roleName, role);
    }

    for (const seedUser of seedUsers) {
      const role = roles.get(seedUser.role);
      if (!role) throw new Error(`Role "${seedUser.role}" was not seeded.`);

      let user = await userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .leftJoinAndSelect('user.roles', 'roles')
        .where('user.email = :email', { email: seedUser.email })
        .getOne();

      if (!user) {
        user = userRepository.create({
          email: seedUser.email,
          name: seedUser.name,
          password: await hash(seedUser.password, 10),
          roles: [role]
        });
      } else {
        user.name = seedUser.name;
        user.password = await hash(seedUser.password, 10);
        user.roles = [role];
      }

      await userRepository.save(user);
    }
  } finally {
    await dataSource.destroy();
  }
}

seed()
  .then(() => {
    console.log('Database seeded successfully.');
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
