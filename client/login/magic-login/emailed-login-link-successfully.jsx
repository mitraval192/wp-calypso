/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import page from 'page';

/**
 * Internal dependencies
 */
import { login } from 'lib/paths';
import Card from 'components/card';
import RedirectWhenLoggedIn from 'components/redirect-when-logged-in';
import { hideMagicLoginRequestForm } from 'state/login/magic-login/actions';
import { getCurrentLocaleSlug } from 'state/selectors';
import { recordPageViewWithClientId as recordPageView } from 'state/analytics/actions';
import Gridicon from 'gridicons';

class EmailedLoginLinkSuccessfully extends React.Component {
	static propTypes = {
		hideMagicLoginRequestForm: PropTypes.func.isRequired,
		locale: PropTypes.string.isRequired,
		recordPageView: PropTypes.func.isRequired,
	};

	componentDidMount() {
		this.props.recordPageView( '/log-in/link', 'Login > Link > Emailed' );
	}

	onClickBackLink = event => {
		event.preventDefault();

		this.props.hideMagicLoginRequestForm();

		page( login( { isNative: true, locale: this.props.locale } ) );
	};

	render() {
		const { translate, emailAddress } = this.props;
		const line = [
			emailAddress
				? translate( 'We just emailed a link to %(emailAddress)s.', {
					args: {
						emailAddress,
					},
				} )
				: translate( 'We just emailed you a link.' ),
			' ',
			translate( 'Please check your inbox and click the link to log in.' ),
		];

		return (
			<div>
				<RedirectWhenLoggedIn
					redirectTo="/help"
					replaceCurrentLocation={ true }
					waitForEmailAddress={ emailAddress }
				/>

				<h1 className="magic-login__form-header">{ translate( 'Check your email!' ) }</h1>

				<Card className="magic-login__form">
					<img
						src="/calypso/images/login/check-email.svg"
						className="magic-login__check-email-image"
					/>
					<p>{ line }</p>
				</Card>

				<div className="magic-login__footer">
					<a
						href={ login( { isNative: true, locale: this.props.locale } ) }
						onClick={ this.onClickBackLink }
					>
						<Gridicon icon="arrow-left" size={ 18 } />
						{ translate( 'Back' ) }
					</a>
				</div>
			</div>
		);
	}
}

const mapState = state => ( {
	locale: getCurrentLocaleSlug( state ),
} );

const mapDispatch = {
	hideMagicLoginRequestForm,
	recordPageView,
};

export default connect( mapState, mapDispatch )( localize( EmailedLoginLinkSuccessfully ) );
