import Poll from './Poll';
import sequelize from './sequelize';
import Vote from './Vote';

export async function setupDb() {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
}

Poll.hasMany(Vote, {
    sourceKey: 'id',
    foreignKey: 'poll',
    as: 'votes',
});

Vote.hasOne(Poll, {
    sourceKey: 'poll',
    foreignKey: 'id',
});
