import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    HasOneGetAssociationMixin,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from 'sequelize';
import type Poll from './Poll';
import sequelize from './sequelize';

export default class Vote extends Model<InferAttributes<Vote>, InferCreationAttributes<Vote>> {
    declare id: CreationOptional<number>;
    declare createdBy: string;
    declare choices: string[];
    declare poll: ForeignKey<Poll['id']>;

    declare getPoll: HasOneGetAssociationMixin<Poll>;
}

Vote.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    poll: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: 'Poll',
            key: 'id',
        },
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    choices: {
        type: DataTypes.JSON,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'Vote',
});
