import bcrypt from "bcryptjs";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { BadRequestError, NotFoundError } from "../helpers/apiError";
import { validate } from "class-validator";
import { formatErrors } from "../helpers/formatErrors";
import { threadCpuUsage } from "node:process";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  validateSchema = async (data: Partial<User>, partial = false) => {
    const temp = this.userRepository.create(data);
    const errors = await validate(temp, { skipMissingProperties: partial });
    if (errors.length > 0) {
      const formattedErrors = formatErrors(errors);
      throw new BadRequestError("Falha de validação", formattedErrors);
    }
  };

  create = async (userData: Partial<User>) => {
    const exists = await this.userRepository.findOneBy({
      email: userData.email,
    });
    if (exists) {
      throw new BadRequestError("Email fornecido já em uso");
    }

    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    return await this.userRepository.save({
      ...userData,
      password: hashedPassword,
    });
  };

  update = async (id: number, userData: Partial<User>) => {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }

    if (userData.email && userData.email !== user.email) {
      const exists = await this.userRepository.findOneBy({
        email: userData.email,
      });
      if (exists) {
        throw new BadRequestError("Email já está em uso por outro usuário");
      }
    }

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    this.userRepository.merge(user, userData);
    return await this.userRepository.save(user);
  };

  list = async () => {
    return await this.userRepository.find();
  };

  listActive = async (active = true) => {
    return await this.userRepository.findBy({ isActive: active });
  };

  listById = async (id: number) => {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }

    return user;
  };

  delete = async (id: number) => {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }

    return await this.userRepository.delete(id);
  };

  toggleActive = async (id: number) => {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }
    user.isActive = !user.isActive;
    await this.userRepository.save(user);
    return user;
  };
}
