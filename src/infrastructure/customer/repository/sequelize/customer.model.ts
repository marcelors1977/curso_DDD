import {Column, PrimaryKey, Model, Table} from "sequelize-typescript";


@Table({
    tableName: "customers",
    timestamps: false
})
export default class CustomerModel extends Model { 
    @PrimaryKey
    @Column
    declare id: string;

    @Column({ allowNull: false })
    declare name: string;

    @Column
    declare street: string;

    @Column
    declare number: number;

    @Column
    declare zipcode: string;
    
    @Column
    declare city: string;

    @Column({ allowNull: false })
    declare active: boolean;

    @Column({ allowNull: false })
    declare rewardPoints: number;
}
