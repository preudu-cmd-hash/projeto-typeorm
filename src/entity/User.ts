import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from "class-validator";
import { IsBrPhoneConstraint } from "../decorators/IsBrPhone";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  @IsNotEmpty({ message: "Primeiro nome é obrigatório!" })
  @IsString({ message: "Primeiro nome precisa ser um texto" })
  firstName!: string;

  @Column("varchar")
  @IsNotEmpty({ message: "Sobrenome é obrigatório!" })
  @IsString({ message: "Sobrenome precisa ser um texto" })
  lastName!: string;

  @Column({ type: "varchar", unique: true, length: 254, nullable: false })
  @IsNotEmpty({ message: "O email é obrigatório" })
  @IsEmail({}, { message: "O email fornecido não é válido" })
  email!: string;

  @Column({ type: "varchar", select: false })
  @IsNotEmpty({ message: "a senha é obrigatória" })
  @MinLength(6, { message: "A senha deve conter no mínimo 6 caracteres" })
  password!: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  @IsNotEmpty({ message: "O cargo (role) é obrigatório" })
  @IsEnum(UserRole, { message: "Cargo inválido, utilize 'user' ou 'admin'" })
  role: UserRole;

  @Column({ type: "varchar", length: 15, nullable: false })
  @IsNotEmpty({ message: "O número de telefone é obrigatório" })
  @Validate(IsBrPhoneConstraint)
  phone!: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;
  // Um usuário pode ter muitos posts
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
