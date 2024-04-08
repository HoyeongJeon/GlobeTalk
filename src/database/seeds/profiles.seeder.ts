import { ProfileModel } from 'src/profiles/entities/profile.entity';
import { UserModel } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class ProfilesSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(UserModel);
    const profileRepository = dataSource.getRepository(ProfileModel);
    const userFactory = factoryManager.get(UserModel);
    const profileFactory = factoryManager.get(ProfileModel);

    for (let i = 0; i < 100; i++) {
      // User 인스턴스 생성
      const user = await userFactory.make();
      // User 인스턴스 저장
      await userRepository.save(user);

      // Profile 인스턴스 생성
      const profile = await profileFactory.make();
      profile.User = user;
      // Profile 인스턴스 저장
      await profileRepository.save(profile);
    }
  }
}
