/**
 * External dependencies
 */
const config = require( 'config' );

/**
 * Internal dependencies
 */
const { clearAndFillInput } = require( '../page-utils' );
const {
	WP_ADMIN_ALL_ORDERS_VIEW,
	WP_ADMIN_DASHBOARD,
	WP_ADMIN_LOGIN,
	WP_ADMIN_NEW_COUPON,
	WP_ADMIN_NEW_ORDER,
	WP_ADMIN_NEW_PRODUCT,
	WP_ADMIN_PERMALINK_SETTINGS,
	WP_ADMIN_PLUGINS,
	WP_ADMIN_SETUP_WIZARD,
	WP_ADMIN_WC_SETTINGS
} = require( './constants' );

const baseUrl = config.get( 'url' );
const WP_ADMIN_SINGLE_CPT_VIEW = ( postId ) => baseUrl + `wp-admin/post.php?post=${ postId }&action=edit`;

const merchant = {
	login: async () => {
		await page.goto( WP_ADMIN_LOGIN, {
			waitUntil: 'networkidle0',
		} );

		await expect( page.title() ).resolves.toMatch( 'Log In' );

		await clearAndFillInput( '#user_login', ' ' );

		await page.type( '#user_login', config.get( 'users.admin.username' ) );
		await page.type( '#user_pass', config.get( 'users.admin.password' ) );

		await Promise.all( [
			page.click( 'input[type=submit]' ),
			page.waitForNavigation( { waitUntil: 'networkidle0' } ),
		] );
	},

	logout: async () => {
		// Log out link in admin bar is not visible so can't be clicked directly.
		const logoutLinks = await page.$$eval(
			'#wp-admin-bar-logout a',
			( am ) => am.filter( ( e ) => e.href ).map( ( e ) => e.href )
		);

		await page.goto( logoutLinks[ 0 ], {
			waitUntil: 'networkidle0',
		} );
	},

	openAllOrdersView: async () => {
		await page.goto( WP_ADMIN_ALL_ORDERS_VIEW, {
			waitUntil: 'networkidle0',
		} );
	},

	openDashboard: async () => {
		await page.goto( WP_ADMIN_DASHBOARD, {
			waitUntil: 'networkidle0',
		} );
	},

	openNewCoupon: async () => {
		await page.goto( WP_ADMIN_NEW_COUPON, {
			waitUntil: 'networkidle0',
		} );
	},

	openNewOrder: async () => {
		await page.goto( WP_ADMIN_NEW_ORDER, {
			waitUntil: 'networkidle0',
		} );
	},

	openNewProduct: async () => {
		await page.goto( WP_ADMIN_NEW_PRODUCT, {
			waitUntil: 'networkidle0',
		} );
	},

	openPermalinkSettings: async () => {
		await page.goto( WP_ADMIN_PERMALINK_SETTINGS, {
			waitUntil: 'networkidle0',
		} );
	},

	openPlugins: async () => {
		await page.goto( WP_ADMIN_PLUGINS, {
			waitUntil: 'networkidle0',
		} );
	},

	openSettings: async ( tab, section = null ) => {
		let settingsUrl = WP_ADMIN_WC_SETTINGS + tab;

		if ( section ) {
			settingsUrl += `&section=${ section }`;
		}

		await page.goto( settingsUrl, {
			waitUntil: 'networkidle0',
		} );
	},

	runSetupWizard: async () => {
		await page.goto( WP_ADMIN_SETUP_WIZARD, {
			waitUntil: 'networkidle0',
		} );
	},


	goToOrder: async ( orderId ) => {
		await page.goto( WP_ADMIN_SINGLE_CPT_VIEW( orderId ), {
			waitUntil: 'networkidle0',
		} );
	},

	updateOrderStatus: async ( orderId, status ) => {
		await page.goto( WP_ADMIN_SINGLE_CPT_VIEW( orderId ), {
			waitUntil: 'networkidle0',
		} );
		await expect( page ).toSelect( '#order_status', status );
		await page.waitFor( 2000 );
		await expect( page ).toClick( 'button.save_order' );
		await page.waitForSelector( '#message' );
		await expect( page ).toMatchElement( '#message', { text: 'Order updated.' } );
	},
};

module.exports = merchant;
