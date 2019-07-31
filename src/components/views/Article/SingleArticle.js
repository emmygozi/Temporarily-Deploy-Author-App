import React, { PureComponent } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Rater from 'react-rater';
import Tags from '@components/commons/Cards/Tags';
import ReactHtmlParser from 'react-html-parser';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { calculateRT } from "@components/commons/Cards/Article";
import PageLayout from '@components/layout/PageLayout';
import ArticleRating from '@components/commons/Cards/displayStar';
import FontAwesome from '@components/commons/utilities/FontAwesome';
import { faThumbsUp } from '@fortawesome/fontawesome-free-solid'
import Preloader from '@components/commons/Preloader';
import { likeArticle, unlikeArticle } from '@actions/articles';
import CommentsContainer from '../../../containers/CommentsContainer';
// import convertToJSON from '../../../helpers/convertToJSON';
import 'react-rater/lib/react-rater.css'
import './index.scss';


class SingleArticle extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        articleId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    user: PropTypes.shape({
      username: PropTypes.string,
      id: PropTypes.string
    }).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    article: PropTypes.shape({
      title: PropTypes.string,
      body: PropTypes.string,
      createdAt: PropTypes.string,
      averageRating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      author: PropTypes.shape({
        username: PropTypes.string.isRequired,
        profile: PropTypes.shape({
          firstname: PropTypes.string,
          lastname: PropTypes.string,
          avatar: PropTypes.string
        }).isRequired
      })
    }).isRequired,
    likeArticle: PropTypes.func.isRequired,
    unlikeArticle: PropTypes.func.isRequired,
    getSingleArticle: PropTypes.func.isRequired,
    getAllTags: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    rating: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);

    this.defaultAvatar =
      'https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png';

  }

  componentDidMount() {
    const {
      match: {
        params: { articleId }
      }
    } = this.props;
    const { getSingleArticle, getAllTags } = this.props;
    getSingleArticle(articleId);
    getAllTags(articleId);
  }

  componentWillReceiveProps(nextProps) {
    const {
      match: {
        params: { articleId }
      },
      getSingleArticle,
      getAllTags
    } = this.props;
    const {
      match: {
        params: { articleId: newArticleId }
      }
    } = nextProps;
    if (articleId !== newArticleId) {
      getSingleArticle(newArticleId);
      getAllTags(newArticleId);
    }
  }

  formatString = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  getArticleBody = raw => {
    if (!raw) {
      return;
    }

    // return convertToJSON(JSON.parse(raw));
    return raw
  };

  rateArticle = rated => {
    const { article, updateRatings } = this.props;
    const rate = {
      rate: rated.rating
    }
    updateRatings(rate, article.slug);
  }

  handleLikes = (slug, likes) => {
    const { likeArticle, unlikeArticle, user } = this.props;

    const userId = user.id;

    if (likes.filter(like => like.userId === userId).length > 0) {
      unlikeArticle(slug);
    } else {
      likeArticle(slug);
    }
  }

  findLike(likes) {
    let { user } = this.props;

    if (likes.filter(like => like.userId === user.id).length > 0) {
      return true
    } else {
      return false
    }
  }

  render() {
    const { article, tags, isAuthenticated, rating } = this.props;
    const { ArticleLikes: likes } = article

    if (!article.author) {
      return (
        <Preloader
          type='page'
          styles='Triangle'
          width={80}
          height={80}
          color='blue'
        />
      );
    }
    const fullname = `${article.author.profile.firstname || ''} ${article.author
      .profile.lastname || ''}`;

    let body;
    if (article) {
      body = this.getArticleBody(article.body);
    }

    return (
      <PageLayout>
        <Helmet>
          <title>{`${article.title} - Author's Haven`}</title>
        </Helmet>
        <div className='content-area mx-auto mt-8'>
          <h2 className='text-3xl font-semibold title tracking-wider'>
            {article.title}
          </h2>

          <div className='my-8 flex items-center'>
            <img
              className='w-12 h-12 rounded-full mr-4'
              src={article.author.profile.avatar || this.defaultAvatar}
              alt='Avatar of Jonathan Reinink'
            />
            <div className='ml-4'>
              <h4 className='text-sm'>
                {fullname === ' '
                  ? this.formatString(article.author.username)
                  : fullname}

              </h4>
              <div className='flex items-center text-sm text-gray-600'>
                <p className='text-xs'>
                  {moment(article.createdAt).format('MMM DD, YYYY')}
                </p>
                <span className='mx-3 text-black my-auto'>.</span>
                <p className='text-xs'>{`${calculateRT(article.body, 300)} read`}</p>
                <span className='mx-3 text-black my-auto'>.</span>
                <span className>
                  <FontAwesome
                    type={faThumbsUp}
                    onClick={() => this.handleLikes(article.slug, likes)}
                    styleClass={
                      classnames('cursor-pointer', {
                        'clapped': this.findLike(likes),
                        'faThumbsUp': !this.findLike(likes)
                      })
                    }
                  />
                  <span className='ml-1'>
                    {likes.length}
                  </span>
                </span>
              </div>

              <span className='mt-12'>
                <ArticleRating
                  averageRating={rating ? rating : 0}
                />
              </span>
            </div>
          </div>

          <div className='text-lg body'>{ReactHtmlParser(body)}</div>

          <div className='py-5 border-b-2'>
            <Tags tags={tags} />
            <Rater total={5} rating={rating ? rating : 0} onRate={this.rateArticle} interactive={isAuthenticated ? true : false} />
          </div>

          <div className='comments my-4'>
            <h2 className='text-lg font-semibold comment-res'>Responses</h2>
          </div>

          <CommentsContainer slug={article.slug} />
        </div>
      </PageLayout>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  profile: state.auth.profile
});

export default connect(mapStateToProps, { likeArticle, unlikeArticle })(SingleArticle);
