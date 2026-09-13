<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'dynam108_WP6XE');

/** MySQL database username */
define('DB_USER', 'dynam108_WP6XE');

/** MySQL database password */
define('DB_PASSWORD', 'g6X8%!o2%7y41pM{C');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY', '0180591a2a6e8b3ca3c14dcf0dfbd35d25137d67d7daa8211d07f587ace53f98');
define('SECURE_AUTH_KEY', 'e3a4f433e03b79bfde778f0e3364a48975a77284db0feb364b8aa6a42f8a304f');
define('LOGGED_IN_KEY', '2520299cacf10d35c38080ebf1ba7d0c354c88123cae64980a185c3e73a7cf45');
define('NONCE_KEY', '6c96e8cc4c569efc86aac0732ec8fdff2410c458fd3f14f4c6de044a672c43b4');
define('AUTH_SALT', '38ec796c58f1da001d263d58da0727d27c7000ed9130fda795892993ea3fd329');
define('SECURE_AUTH_SALT', 'fba21cd7c8f592a18b5c42c4ee1db953526d86ac5b35e2ba20b12560408540c8');
define('LOGGED_IN_SALT', '92fa9015a0ad484e2a765f71c789ab1ba073e4dd3c49f4f8d965b3b0f473065f');
define('NONCE_SALT', 'e2d0f3aa6233e75652219f9944f19231b95b86b4620296ef16c43785af5ac20c');

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'TKk_';
define('WP_CRON_LOCK_TIMEOUT', 120);
define('AUTOSAVE_INTERVAL', 300);
define('WP_POST_REVISIONS', 5);
define('EMPTY_TRASH_DAYS', 7);
define('WP_AUTO_UPDATE_CORE', true);

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
