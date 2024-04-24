import { State } from 'src/common/enums/state.enum';
import { ProfileModel } from 'src/profiles/entities/profile.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(ProfileModel, (faker) => {
  const profile = new ProfileModel();

  profile.nickname = faker.internet.userName();
  if (profile.nickname.length > 8) {
    profile.nickname = profile.nickname.slice(0, 8);
  }
  profile.introduce = faker.lorem.sentence();
  profile.major = faker.lorem.word();
  profile.language = ['ko', 'en', 'de'];
  profile.state = faker.helpers.arrayElement(Object.values(State));
  profile.imageUrl =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGPDfmtAPKxQ2W04DKIHmgNv6IViKbGQ8a7tL594ooMw&s';

  profile.createdAt = new Date();
  profile.updatedAt = new Date();

  return profile;
});
