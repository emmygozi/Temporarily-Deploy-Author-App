import React, { PureComponent } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Rater from 'react-rater';
import Tags from '@components/commons/Cards/Tags';
import ReactHtmlParser from 'react-html-parser';
import Helmet from 'react-helmet';
import { calculateRT } from "@components/commons/Cards/Article";
import PageLayout from '@components/layout/PageLayout';
import ArticleRating from '@components/commons/Cards/displayStar';
import Preloader from '@components/commons/Preloader';
import CommentsContainer from '../../../containers/CommentsContainer';
import convertToJSON from '../../../helpers/convertToJSON';
import 'react-rater/lib/react-rater.css'
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
    getAllTags: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    rating: PropTypes.number.isRequired,
    updateRatings: PropTypes.func.isRequired,
    fetchRatings: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.defaultAvatar =
      'https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png';
      this.state = {
        rate: 0
      }

      const { article, fetchRatings } = props;
      fetchRatings(article.slug);
      
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

  rateArticle = rated => {
    const { article, updateRatings } = this.props;
    this.setState({
      rate: rated.rating
    })
    const rate = {
      rate: rated.rating
    }
    updateRatings(rate, article.slug);
  }

  render() {
    const { article, tags, isAuthenticated, rating } = this.props;
    const { rate } = this.state;
    
    if (!article.author) {
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
              </div>
              <ArticleRating
                averageRating={rating ? rating : 0} 
              />
            </div>
          </div>

          <div className='text-lg body'>{ReactHtmlParser(body)}</div>

          <div className='py-5 border-b-2'>
            <Tags tags={tags} />
            <Rater total={5} rating={rate} onRate={this.rateArticle} interactive={isAuthenticated ? true : false} />
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
