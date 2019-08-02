import { connect } from 'react-redux';
import AuthorizeProfile from '../../hoc/AuthorizeProfile';

/**
 * Authorize Article User
 * @function AuthorizeProfile
 * @param {JSX} MyComponent - Dynamic
 * @return {JSX} ConnectedComponent
 */
export default (MyComponent) => {
    const mapStateToProps = state => ({
        profile: state.profile.profile,
        user: state.auth.user,
        loading: state.profile.loading,
        MyComponent
    });

    return connect(mapStateToProps)(AuthorizeProfile);
};