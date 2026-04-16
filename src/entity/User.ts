import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  firstName!: string;

  @Column("varchar")
  lastName!: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;
  // Um usuário pode ter muitos posts
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
