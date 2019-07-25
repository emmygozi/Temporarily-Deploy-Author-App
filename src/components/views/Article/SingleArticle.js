import React, { PureComponent } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Tags from '@components/commons/Cards/Tags';
import ReactHtmlParser from 'react-html-parser';
import Helmet from 'react-helmet';
import PageLayout from '@components/layout/PageLayout';
import ArticleRating from '@components/commons/Cards/displayStar';
import Preloader from '@components/commons/Preloader';
import convertToJSON from '../../../helpers/convertToJSON';
import CommentsContainer from '../CommentsContainer';
import './index.scss';

class SingleArticle extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        articleId: PropTypes.string.isRequired
      }).isRequired
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
    getSingleArticle: PropTypes.func.isRequired,
    getAllTags: PropTypes.func.isRequired
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
    return convertToJSON(JSON.parse(raw));
  };

  render() {
    const { article, tags } = this.props;
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
                <p className='text-xs'>1 mins read</p>
              </div>
              <ArticleRating
                averageRating={
                  article.averageRating ? article.averageRating : 0
                }
              />
            </div>
          </div>

          <div className='text-lg body'>{ReactHtmlParser(body)}</div>

          <div className='py-5 border-b-2'>
            <Tags tags={tags} />
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

export default SingleArticle;
