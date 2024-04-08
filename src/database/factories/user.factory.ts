import { UserModel } from 'src/users/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(UserModel, (faker) => {
  const user = new UserModel();

  user.email = faker.internet.email();
  user.password =
    '$2b$10$jq9GrYVYILYCJ3lX6Pfi0eywoFoINqmTWJfPyFaWTq23jcifynAcy';
  user.nickname = faker.internet.userName();
  if (user.nickname.length > 8) {
    user.nickname = user.nickname.slice(0, 8);
  }
  user.country = faker.location.country();
  user.createdAt = new Date();
  user.updatedAt = new Date();

  return user;
});
