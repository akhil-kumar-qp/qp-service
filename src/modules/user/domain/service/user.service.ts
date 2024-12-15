import { UserRepository } from '../repository/user.repository';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByIdOrThrow(id: number) {
    const userData = this.userRepository.findById(id);

    if (!userData) {
      throw Error('User not found');
    }

    return userData;
  }

  async findUsersWithAutoRenewal() {
    return this.userRepository.findUsersWithAutoRenewal();
  }
}
