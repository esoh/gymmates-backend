'use strict';
const SchemaError = require('../utils/SchemaError');

module.exports = (sequelize, DataTypes) => {
    const ExerciseLog = sequelize.define('ExerciseLog', {
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        exerciseName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        progress: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {});

    ExerciseLog.associate = function(models) {
        ExerciseLog.belongsTo(models.User, {
            as: 'user',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    ExerciseLog.getExerciseHistory = function(userId) {
        return ExerciseLog.findAll({ where: { userUuid: userId } })
    }

    ExerciseLog.addExerciseLog = function(userId, date, exerciseName, type, progress){
        return new Promise((resolve, reject) => {
            ExerciseLog.create({
                date,
                exerciseName,
                type,
                progress,
                userUuid:   userId,
            })
                .then(exerciseLog => {
                    return resolve(exerciseLog)
                })
                .catch(err => {
                    var schemaErr = new SchemaError(err);
                    if(schemaErr) return reject(schemaErr);
                    return reject(err);
                })
        });
    }

    return ExerciseLog;
};