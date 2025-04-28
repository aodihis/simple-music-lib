/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {

    pgm.createTable('user_album_likes', {
        user_id: {
            type: 'varchar(21)',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        album_id: {
            type: 'varchar(21)',
            notNull: true,
            references: '"albums"',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
    });


    pgm.addConstraint('user_album_likes', 'user_album_likes_pkey', {
        primaryKey: ['user_id', 'album_id']
    });


    pgm.addConstraint('user_album_likes', 'user_album_likes_unique', {
        unique: ['user_id', 'album_id']
    });


    pgm.createIndex('user_album_likes', 'user_id');
    pgm.createIndex('user_album_likes', 'album_id');
};

exports.down = pgm => {
    pgm.dropTable('user_album_likes');
};