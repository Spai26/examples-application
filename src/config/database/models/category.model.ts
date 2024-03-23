import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "category" })
export class CategoryModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => CategoryModel, { nullable: true })
  @JoinColumn({ name: "parent_category_id" })
  parent_category: CategoryModel | null = null;
}
