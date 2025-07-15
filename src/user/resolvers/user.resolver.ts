import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseFilters, UseGuards, HttpStatus } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { UserFilter } from '../exceptions/UserFilter.exception'
import { UserErrors, USER_ERROR_CODES } from '../exceptions/UserErrors.exception';
import { GetCurrentUser } from 'src/utils/GetCurrentUser.util';
import { serverData } from '../../utils/serverData';
import { UserDTO } from '../dtos/user.dto';
import { User } from '../entities';
import { CreateUserInputDTO } from '../dtos/create-user-input.dto';
import { EditUserInputDTO } from '../dtos/edit-user-input.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Resolver()
export class UserResolver {
  @Query(() => [UserDTO])
  async getUsers(): Promise<UserDTO[]> {
    const users = await User.find();

    return users;
  }

  @Query(() => UserDTO)
  @UseFilters(UserFilter)
  async getUser(@Args('id') id: number): Promise<UserDTO> {
    const user = await User.findOne({
      where: { id },
      relations: ['profile']
    });

    user.profile.url = `${serverData.baseUrl}/static/${user.profile.name}`

    if (!user) {
      throw new UserErrors(
        'user not found',
        USER_ERROR_CODES.userNotFound,
        HttpStatus.NOT_FOUND
      );
    }

    return user;
  }

  @Mutation(() => UserDTO)
  async createUser(
    @Args('data', { type: () => CreateUserInputDTO }) data: CreateUserInputDTO,
  ): Promise<UserDTO> {
    const user = new User();

    user.email = data.email;
    user.password = await bcrypt.hash(data.password, 8);
    user.status = data.status;
    user.name = data.name;

    await user.save();

    return user;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => UserDTO)
  async editUser(
    @Args('id') id: number,
    @Args('data', { type: () => EditUserInputDTO }) data: EditUserInputDTO,
    @GetCurrentUser() userId: number
  ): Promise<UserDTO> {
    const user = await User.findOneBy({ id });

    if (!user || user.id !== userId) {
      throw new UserErrors(
        'user does not have permission to edit',
        USER_ERROR_CODES.userDoesNotHavePermission,
        HttpStatus.UNAUTHORIZED
      );
    }

    user.name = data.name || user.name;
    user.status = data.status || user.status;

    await user.save();

    return user;
  }
}
