import { Sequelize } from 'sequelize';
import config from 'src/config';

const sequelize = new Sequelize(config.mysql.url);

export default sequelize;
