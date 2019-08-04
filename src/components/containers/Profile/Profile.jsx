import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import ReactModal from 'react-modal';
import { extractArticleDetails, calculateRT } from '@components/commons/Cards/Article';
import Preloader from '@components/commons/Preloader';
import PageLayout from '@components/layout/PageLayout';
import { getProfile, getUserArticles } from '@actions/profile';
import { deleteArticle } from '@actions/articles';
import { Tabs } from 'rmc-tabs';
import 'rmc-tabs/assets/index.css';
import './Profile.scss';

ReactModal.setAppElement('#app');
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    backgroundColor       : 'rgba(255,255,255,0.9)',
    transform             : 'translate(-50%, -50%)'
  }
};
class Profile extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        username: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    articles: PropTypes.array.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }
    this.defaultAvatar =
      'https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png';
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  componentDidMount() {
    const { match: { params: { username } }, getProfile } = this.props;
    getProfile(username);
  }

  handleOpenModal () {
    this.setState({ showModal: true });
  }
  
  handleCloseModal () {
    this.setState({ showModal: false });
  }

  deleteArticle(article) {
    const { deleteArticle } = this.props;
    this.setState({
      showModal: false
    })
    deleteArticle(article);
  }

  render() {
    const { match: { params: { username } }, user, profile, articles } = this.props;
    const { showModal } = this.state;
    const { firstname, lastname } = profile;
    const fullname = `${firstname || ''} ${lastname || ''}`;

    if (!profile.userId) {
      return (
        <Preloader
          type='page'
          styles='ThreeDots'
          width={80}
          height={80}
          color='blue'
        />
      );
    }

    return (
      <PageLayout>
        <div className="mt-16 profile-container mx-auto">
          <div className="flex flex-col lg:flex-row md:flex-row items-center lg:justify-start md:justify-start justify-center text-center">
            <div className="relative avatar-img">
              <img src={profile.avatar || this.defaultAvatar} alt="Profile" className="shadow-lg rounded-full w-32 h-32 flex justify-center" />
            </div>
            <div className="lg:ml-8 md:ml-8 flex flex-col lg:justify-start md:justify-start justify-center">
              <h2 className="text-3xl font-lobster text-black font-bold tracking-widest">{fullname === ' ' || 'John Doe'}</h2>
              <div className="block mx-auto">
                {user.id === profile.userId && <Link to={`/profile/${username}/edit`} className="border py-1 px-2 mt-4 text-sm rounded text-blue-700 border-blue-700">Edit Profile</Link>}
              </div>
            </div>
          </div>
          <div className="mt-8">
            <Tabs
              tabs={[
                { key: 'Profile', title: 'Profile' },
                { key: 'Articles', title: 'Articles' },
              ]}
              initalPage="Profile"
            >
              <div key="Profile">
                <div className="mt-4 text-center">
                  <div className="profile-extra">
                    <div className="flex flex-row justify-between mb-4">
                      <h2 className="font-semibold">Firstname</h2>
                      <h2>{profile.firstname}</h2>
                    </div>
                    <div className="flex jjustify-between mb-4">
                      <h2 className="font-semibold">Lastname</h2>
                      <h2>{profile.lastname}</h2>
                    </div>
                    <div className="flex justify-between mb-4">
                      <h2 className="font-semibold">Bio</h2>
                      <h2>{profile.bio}</h2>
                    </div>
                    <div className="flex justify-between mb-4">
                      <h2 className="font-semibold">Phone Number</h2>
                      <h2>{profile.phone}</h2>
                    </div>
                    <div className="flex justify-between mb-4">
                      <h2 className="font-semibold">Location</h2>
                      <h2>{profile.location}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div key="Articles">
                {articles.map((article, index) => {
                  const { body } = extractArticleDetails(article, false);
                  return (
                    <div className="mt-2" key={index.toString()}>
                      <div className="w-full rounded border border-gray-300 shadow-md p-8 mb-6">
                        <div className="flex justify-between mb-4">
                          <div className="flex">
                            <img src={article.author.profile.avatar || this.defaultAvatar} alt="gravatar" className="w-12 h-12 rounded-full" />
                            <div className="flex flex-col ml-4">
                              <h3 className="text-base text-gray-800">{article.author.username}</h3>
                              <p className="text-sm text-gray-500">{`${moment(article.createdAt).format('MMM DD, YYYY')} . ${calculateRT(article.body, 400)} read`}</p>
                            </div>
                          </div>
                          {user.id === article.author.id && (
                            <span className="cursor-pointer relative more" role="presentation" onClick={() => {}}>
                              <ul>
                                <li className="text-sm font-normal hover:text-black border-b border-gray-200">
                                  <Link to={`/article/${article.slug}/edit`} className="block px-2 text-gray-600">Edit</Link>
                                </li>
                                <li>
                                  <button type="button" className="w-full text-sm font-normal text-black block py-1 px-2 text-gray-600" onClick={this.handleOpenModal}>Delete</button>
                                </li>
                              </ul>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="20"
                                height="20"
                                viewBox="0 0 30 30"
                                style={{ fill: '#ffffff' }}
                              >
                                <path fill="#8bb7f0" d="M15 12.5A2.5 2.5 0 1 0 15 17.5A2.5 2.5 0 1 0 15 12.5Z" />
                                <path fill="#4e7ab5" d="M15,13c1.103,0,2,0.897,2,2s-0.897,2-2,2s-2-0.897-2-2S13.897,13,15,13 M15,12c-1.657,0-3,1.343-3,3 s1.343,3,3,3s3-1.343,3-3S16.657,12,15,12L15,12z" />
                                <path fill="#8bb7f0" d="M26 12.5A2.5 2.5 0 1 0 26 17.5A2.5 2.5 0 1 0 26 12.5Z" />
                                <path fill="#4e7ab5" d="M26,13c1.103,0,2,0.897,2,2s-0.897,2-2,2s-2-0.897-2-2S24.897,13,26,13 M26,12c-1.657,0-3,1.343-3,3 s1.343,3,3,3s3-1.343,3-3S27.657,12,26,12L26,12z" />
                                <g>
                                  <path fill="#8bb7f0" d="M4 12.5A2.5 2.5 0 1 0 4 17.5A2.5 2.5 0 1 0 4 12.5Z" />
                                  <path fill="#4e7ab5" d="M4,13c1.103,0,2,0.897,2,2s-0.897,2-2,2s-2-0.897-2-2S2.897,13,4,13 M4,12c-1.657,0-3,1.343-3,3 s1.343,3,3,3s3-1.343,3-3S5.657,12,4,12L4,12z" />
                                </g>
                              </svg>
                            </span>
                          )}
                        </div>

                        <ReactModal
                          isOpen={showModal}
                          contentLabel="onRequestClose Example"
                          onRequestClose={this.handleCloseModal}
                          style={customStyles}
                        >
                          <div className="w-80 text-center">
                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Delete</h2>
                            <p className="text-gray-600 mb-6 text-lg tracking-wide">Deleted stories are gone forever. Are you sure?</p>
                            <div className="flex justify-center">
                              <button type="button" className="hover:text-red-500 hover:border-red-500 text-gray-600 border-gray-600 border mr-4 py-2 px-4 rounded" onClick={this.deleteArticle.bind(this, article)}>Delete</button>
                              <button type="button" className="hover:text-black hover:border-black text-gray-800 border border-gray-800 py-2 px-4 rounded" onClick={this.handleCloseModal}>Cancel</button>
                            </div>
                          </div>
                        </ReactModal>
                        
                        <div className="">
                          <Link to={`/article/${article.slug}`} className="font-sans text-3xl text-black font-semibold leading-tight">{article.title}</Link>
                          <h4 className="font-serif text-lg leading-normal profile-article-desc font-thin text-gray-800 mt-2">{body}</h4>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Tabs>
          </div>
        </div>
      </PageLayout>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profile.profile,
  articles: state.profile.articles,
  user: state.auth.user,
  loading: state.profile.loading,
  errors: state.profile.errors
});

export default connect(mapStateToProps, { getProfile, getUserArticles, deleteArticle })(Profile);
