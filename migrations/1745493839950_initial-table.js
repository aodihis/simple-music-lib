/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('albums', {
        id: {
            type: 'varchar(21)',
            primaryKey: true,
        },
        name: {
            type: 'varchar(255)',
            notNull: true,
        },
        year: {
            type: 'integer',
            notNull: true,
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
    });

    pgm.createTable('songs', {
        id: {
            type: 'varchar(21)',
            primaryKey: true,
        },
        album_id: {
            type: 'varchar(21)',
            notNull: false,
            references: '"albums"',
            onDelete: 'cascade',
        },
        title: {
            type: 'varchar(255)',
            notNull: true,
        },
        year: {
            type: 'integer',
            notNull: true,
        },
        genre: {
            type: 'varchar(100)',
            notNull: true,
        },
        performer: {
            type: 'varchar(255)',
            notNull: true,
        },
        duration: {
            type: 'integer', // Assuming seconds
            notNull: false,
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
    });
};



/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('songs');
    pgm.dropTable('albums');
};
