import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classname from 'classnames';
import logo from '@base/img/logo.png';
import { faSearch } from '@fortawesome/fontawesome-free-solid';
import Modal from '@components/commons/Modal';
import LoginPage from '@components/views/Login';
import SearchCard from '@components/commons/Cards/Search';
import SignupPage from '@components/views/Signup';
import { logoutUser } from '@actions/auth';
import { extractArticleDetails } from '@components/commons/Cards/Article';
import Button from '../utilities/Button';
import FontAwesome from '../utilities/FontAwesome';

export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: true,
      authHidden: true,
      showSearchBar: false,
      showSignInModal: false,
      showSignUpModal: false,
      showSearchResult: false,
      searchResult: [],
      prevScrollpos: window.pageYOffset,
      visible: true
    };

    this.defaultAvatar =
      'https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png';
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const { prevScrollpos } = this.state
   
    const currentScrollPos = window.pageYOffset;
    const isVisible = prevScrollpos > currentScrollPos;
   
    this.setState({
      prevScrollpos: currentScrollPos,
      visible: isVisible
    });
  }


  exitModal = () => {
    this.setState({ showSignUpModal: false, showSignInModal: false });
  };

  logoutBtnClicked = () => {
    this.setState({ authHidden: true });

    const { logoutUser, history } = this.props;
    logoutUser(history);
  };

  toggleSignInDialog = () => {
    const { showSignInModal } = this.state;
    this.setState({
      showSignInModal: !showSignInModal,
      showSignUpModal: false
    });
  };

  toggleSignUpDialog = () => {
    const { showSignUpModal } = this.state;
    this.setState({
      showSignUpModal: !showSignUpModal,
      showSignInModal: false
    });
  };

  showSignupDialog = () => {
    this.setState({ showSignUpModal: true, showSignInModal: false });
  };

  showSigninDialog = () => {
    this.setState({ showSignUpModal: false, showSignInModal: true });
  };

  handleSearch = event => {
    const searchText = event.target.value;
    const { articles } = this.props;

    const filteredArticle = articles.filter(article => {
      return article.title.toLowerCase().indexOf(searchText.toLowerCase()) >= 0;
    });

    if (searchText === '' || filteredArticle.length === 0) {
      this.setState({ showSearchResult: false });
    } else {
      this.setState({
        showSearchResult: true,
        searchResult: filteredArticle
      });
    }
  };

  redirectToNewArticle = () => {
    const { history } = this.props;
    history.push('/new-article');
  };

  authHeaderButtons = avatar => {
    return (
      <Fragment>
        <button
          type='button'
          className='bg-transparent hover:text-white py-2 px-4 border rounded mr-2 text-sm hover:bg-blue-700 border-blue-700 hover:border-transparent'
          onClick={this.redirectToNewArticle}
        >
          New Article
        </button>
        <div className='flex items-center'>
          <FontAwesome
            type={faSearch}
            styleClass='m-2 text-gray-500 mr-4 search-cursor text-2xl'
            role='presentation'
            onKeyDown={this.showSearchBar}
            onClick={this.showSearchBar}
          />
        </div>
        <img
          src={avatar || this.defaultAvatar}
          alt='ProfileImage'
          className='rounded-full w-10 h-10 text-blue-600 cursor-pointer block'
          role='presentation'
          onKeyDown={this.showProfileDropDown}
          onClick={this.showProfileDropDown}
        />
      </Fragment>
    );
  };

  guestHeaderButtons = () => (
    <Fragment>
      <Button type='regular' color='blue' onClick={this.toggleSignInDialog}>
        Sign In
      </Button>
      <button
        type='button'
        className='bg-transparent hover:text-white py-2 px-4 border rounded mr-2 text-sm hover:bg-blue-700 border-blue-700 hover:border-transparent'
        onClick={this.toggleSignUpDialog}
      >
        Get Started
      </button>
    </Fragment>
  );

  showSearchBar = () => {
    const { showSearchBar } = this.state;

    this.setState({
      showSearchBar: !showSearchBar,
      authHidden: showSearchBar ? true : false
    });
  };

  hideDropDownMenu = () => {
    this.setState({ showSearchBar: false, authHidden: true, searchResult: [] });
  };

  toggleHeader = () => {
    const { hidden } = this.state;
    this.setState({
      hidden: !hidden
    });
  };

  showProfileDropDown = () => {
    const { authHidden, showSearchBar } = this.state;
    this.setState({
      authHidden: showSearchBar ? false : !authHidden,
      showSearchBar: false,
      showSearchResult: false
    });
  };

  render() {
    const {
      hidden,
      authHidden,
      showSearchBar,
      showSignInModal,
      showSignUpModal,
      showSearchResult,
      searchResult,
      visible
    } = this.state;
    const { user, isAuthenticated, profile } = this.props;
    const { avatar, firstname, lastname } = profile;
    const { username } = user;

    return (
      <Fragment>
        {!authHidden || showSearchBar ? (
          <div
            className='w-full h-screen bg-gray fixed opacity-75 z-20'
            onClick={this.hideDropDownMenu}
            onKeyDown={this.hideDropDownMenu}
            role='presentation'
          />
        ) : ('')}
        <div
          className={classname('bg-white shadow sticky z-20', {
            'notVisible': !visible
          })}
        >
          <div className='container mx-auto px-4'>
            <div className='flex items-center justify-between py-4'>
              <div className='flex'>
                <Link to='/'>
                  <img
                    src={logo}
                    alt="Authors' Haven Icon"
                    className='w-10 h-9 mr-2'
                  />
                </Link>
                <h1 className='font-bold text-xl sm-text-base'>
                  Author&lsquo;s Haven
                </h1>
              </div>

              <div className='hidden sm:flex sm:items-center'>
                {!isAuthenticated
                  ? this.guestHeaderButtons()
                  : this.authHeaderButtons(avatar)}
              </div>

              <div className='flex sm:hidden cursor-pointer'>
                {!isAuthenticated ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 512 512'
                    className='w-6 h-6 text-blue-600 cursor-pointer'
                    onClick={this.toggleHeader}
                  >
                    <path d='M64 384h384v-42.666H64V384zm0-106.666h384v-42.667H64v42.667zM64 128v42.665h384V128H64z' />
                  </svg>
                ) : (
                    this.authHeaderButtons(avatar)
                  )}
              </div>
            </div>

            <div
              className={classname({
                'block sm:hidden bg-white border-t-2 py-2': true,
                hidden
              })}
            >
              <div className='flex justify-between items-center pt-2'>
                {!isAuthenticated ? this.guestHeaderButtons(avatar) : ''}
              </div>
            </div>
          </div>
        </div>

        <div
          className={classname({
            'block bg-white border-t-2 py-2 shadow-lg fixed right-0 w-full md:w-2/5 lg:w-1/2 z-20': true,
            hidden: authHidden,
            'lg:max-w-xs': !showSearchBar
          })}
        >
          <div className='tooltip container' />
          <div className='flex justify-between items-center pt-2 font-sans text-sm'>
            {isAuthenticated && !showSearchBar ? (
              <div className='p-2 px-2 sm:px-6  w-full'>
                <Link to={`/profile/${username}`}>
                  <div className='border-b pb-4 md:flex lg:flex flex-wrap'>
                    <img
                      src={avatar || this.defaultAvatar}
                      alt='My profile'
                      className='rounded-full w-10 h-10 mx-auto md:mx-0 lg:mx-0'
                    />
                    <div className='ml-0 md:ml-4 lg:ml-4 md:text-left lg:text-left text-center hover:text-blue-700'>
                      <div className='font-bold text-base'>
                        {`${firstname || ''} ${lastname || ''}`}
                      </div>
                      <div className='text-gray-500'>{`@ ${username}`}</div>
                    </div>
                  </div>
                </Link>

                <Link
                  to={`/profile/${username}`}
                  className='block border-b pb-2 hover:text-blue-700 pt-2'
                >
                  Profile
                </Link>
                <Link
                  to='/new-article'
                  className='block border-b pb-2 pt-2 hover:text-blue-700'
                >
                  New Article
                </Link>
                <Button
                  type='regular'
                  color='red'
                  onClick={this.logoutBtnClicked}
                  className='w-full text-left py-2 text-red-700 hover:text-red-800 rounded mr-2'
                  stretch
                >
                  Sign out
                </Button>
              </div>
            ) : (
                ''
              )}

            {isAuthenticated && showSearchBar ? (
              <input
                type='text'
                className='mr-4 resize-x w-full ml-4 mb-2 input'
                placeholder='Search...'
                autoFocus
                onChange={this.handleSearch}
              />
            ) : (
                ''
              )}
          </div>
          {showSearchResult ? (
            <div className='overflow-scroll searchContainer'>
              {searchResult.map(article => {
                const {
                  title,
                  body,
                  fullName,
                  username,
                  time,
                  slug,
                  image
                } = extractArticleDetails(article, true);
                return (
                  <SearchCard
                    key={article.id}
                    title={title}
                    body={body}
                    name={fullName === ' ' ? username : fullName}
                    createdAt={time}
                    slug={slug}
                    image={image}
                  />
                );
              })}
            </div>
          ) : (
              ''
            )}
        </div>

        {showSignInModal && !isAuthenticated ? (
          <Modal title='Welcome Back' exitModal={this.exitModal} toggle>
            {<LoginPage showSignup={this.showSignupDialog} />}
          </Modal>
        ) : (
            ''
          )}

        {showSignUpModal && !isAuthenticated ? (
          <Modal title="Join Author's Haven" exitModal={this.exitModal} toggle>
            {<SignupPage showSignin={this.showSigninDialog} />}
          </Modal>
        ) : (
            ''
          )}
      </Fragment>
    );
  }
}

Header.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string
  }).isRequired,
  profile: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    avatar: PropTypes.string
  }).isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  errors: PropTypes.shape({
    global: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string
  }).isRequired,
  history: PropTypes.shape({}).isRequired,
  logoutUser: PropTypes.func.isRequired,
  articles: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  user: state.auth.user,
  profile: state.auth.profile,
  isAuthenticated: state.auth.isAuthenticated,
  errors: state.auth.errors,
  articles: state.article.articles
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(withRouter(Header));
