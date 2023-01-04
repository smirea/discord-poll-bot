import {
    CreationOptional,
    DataTypes,
    HasManyGetAssociationsMixin,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from 'sequelize';
import sequelize from './sequelize';
import type Vote from './Vote';

export default class Poll extends Model<InferAttributes<Poll>, InferCreationAttributes<Poll>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare choices: string[];
    declare createdBy: string;

    declare getVotes: HasManyGetAssociationsMixin<Vote>;
}

Poll.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    choices: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'Poll',
});
