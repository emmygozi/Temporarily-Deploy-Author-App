import React, { Component, Fragment, createRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { faArrowLeft, faArrowRight } from '@fortawesome/fontawesome-free-solid';
import Header from '@components/commons/Header';
import NavBar from '@components/commons/NavBar';
import ArticleCard, {
  extractArticleDetails
} from '@components/commons/Cards/Article';
import { fetchArticles, fetchMoreArticles } from '@actions/articles';
import FontAwesome from '../commons/utilities/FontAwesome';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentArticle: {},
      currentIndex: 0,
      isMounting: true
    };
    this.articles = [];

    this.familyNextRef = createRef();
    this.familyPreviousRef = createRef();

    this.peopleNextRef = createRef();
    this.peoplePreviousRef = createRef();

    this.andelaNextRef = createRef();
    this.andelaPreviousRef = createRef();
  }

  async componentDidMount() {
    const { fetchArticles } = this.props;
    await fetchArticles();
    this.setState({ isMounting: false });
  }

  componentWillReceiveProps(nextProps) {
    const { mostRated } = this.groupArticles(nextProps.articles);
    this.setState({ currentArticle: mostRated[0], currentIndex: 0 });
  }

  displaySmallArticle = (article, stretch) => {
    return (
      <ArticleCard
        key={Math.random()}
        isSmall
        article={article}
        stretch={stretch}
      />
    );
  };

  displayBigArticle = article => {
    const {
      title,
      body,
      fullName,
      username,
      time,
      slug,
      readTime
    } = extractArticleDetails(article);
    const { currentIndex } = this.state;
    return (
      <div
        className={classNames('text-sm mt-2 content-center', {
          'current-slider-anim1': currentIndex % 2 === 0,
          'current-slider-anim2': currentIndex % 2 === 1
        })}
      >
        <Link to={`/article/${slug}`}>
          <h2 className='font-semibold text-lg hover:text-blue-700 overflow-hidden h-6 mb-1'>
            {title}
          </h2>
        </Link>
        <p className='text-gray-600 h-10 overflow-hidden'>
          {body.length > 240 ? `${body.slice(0, 240)}...` : body}
        </p>
        <Link to={`/profile/${username}`} className='mr-3 hover:text-blue-700'>
          {fullName === ' ' ? username : fullName}
        </Link>
        <div className='font-thin text-gray-600 text-xs'>
          <span>{time}</span>
          <span className='mx-2 text-black font-bold'>.</span>
          <span>{`${readTime} read`}</span>
        </div>
      </div>
    );
  };

  getMostRatedArticles = articles => {
    if (articles[0]) {
      const sortedArticles = articles.sort((a, b) =>
        (a.averageRating || 0) < (b.averageRating || 0)
          ? 1
          : (b.averageRating || 0) < (a.averageRating || 0)
          ? -1
          : 0
      );
      return sortedArticles.slice(0, 10);
    }
    return [];
  };

  getMostRecent = articles => {
    if (articles[0]) {
      const sortedArticles = articles.sort((a, b) =>
        (moment(a.createdAt).format('x') || 0) <
        (moment(b.createdAt).format('x') || 0)
          ? 1
          : (moment(b.createdAt).format('x') || 0) <
            moment(a.createdAt).format('x')
          ? -1
          : 0
      );
      return sortedArticles.slice(0, 3);
    }
    return [];
  };

  groupArticles = articles => {
    const {
      categories: { family, andela, people }
    } = this.props;

    const mostRated = this.getMostRatedArticles(articles);
    const mostRecent = this.getMostRecent(articles);
    let others = [];

    if (family) {
      let allGroups = family.concat(andela, people);
      articles.map(article => {
        const found = allGroups.find(item => item.slug === article.slug);
        if (!found) {
          others.push(article);
        }
        return found;
      });
    }

    return { mostRated, mostRecent, others, family, andela, people };
  };

  clickedArticle = () => {
    const { history } = this.props;
    const {
      currentArticle: { slug }
    } = this.state;
    history.push(`/article/${slug}`);
  };

  smallArticleLoader = () => (
    <div className='w-full mb-4 flex'>
      <div className='mr-2'>
        <Skeleton height={110} width={100} />
      </div>
      <div className='w-full'>
        <Skeleton />
        <p>
          <Skeleton height={40} />
          <Skeleton width={150} />
        </p>
        <Skeleton width={50} />
      </div>
    </div>
  );

  familyPrevious = () => {
    const reference = this.familyPreviousRef;
    if (reference) {
      reference.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  };

  familyNext = () => {
    const reference = this.familyNextRef;
    if (reference) {
      reference.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  };

  andelaPrevious = () => {
    const reference = this.andelaPreviousRef;
    if (reference) {
      reference.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  };

  andelaNext = () => {
    const reference = this.andelaNextRef;
    if (reference) {
      reference.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  };

  peoplePrevious = () => {
    const reference = this.peoplePreviousRef;
    if (reference) {
      reference.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  };

  peopleNext = () => {
    const reference = this.peopleNextRef;
    if (reference) {
      reference.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  };

  handleScroll = event => {
    const {
      nextPage: { next }
    } = this.props;
    const node = event.target;
    const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
    if (bottom) {
      if (next) {
        const { fetchMoreArticles } = this.props;
        fetchMoreArticles(next);
      }
    }
  };

  changeBigArticle = index => {
    const { mostRated } = this.groupArticles(this.articles);
    this.setState({ currentArticle: mostRated[index], currentIndex: index });
  };

  getArticleGroup = category => {
    let articleGroup = [];

    if (!category) return articleGroup;

    const categoryTag = category.map(article => {
      const { image, title, slug, fullName, username } = extractArticleDetails(
        article
      );

      return (
        <div
          className='bg-white shadow-md mb-2 rounded overflow-hidden hover:shadow-lg card--content'
          key={`item-${slug}`}
        >
          <Link to={`/article/${slug}`}>
            <div>
              <div className='item' key={Math.random()}>
                <img
                  src={image}
                  alt={title}
                  className='h-32 object-cover w-full slider-image'
                />
              </div>
              <div className='w-11/12 mx-auto mt-2'>
                <div className='w-full text-gray-700 text-sm line-tight h-12'>
                  {title}
                </div>
                <div className='w-full text-gray-500 text-xs line-tight text-left mb-2'>
                  {fullName === ' ' ? username : fullName}
                </div>
              </div>
            </div>
          </Link>
        </div>
      );
    });

    return categoryTag;
  };

  render() {
    let {
      user,
      profile,
      isAuthenticated,
      articles,
      loading,
      next,
      loadingMore
    } = this.props;
    this.articles = articles;

    const {
      mostRated,
      mostRecent,
      others,
      family,
      andela,
      people
    } = this.groupArticles(articles);
    const { currentArticle, currentIndex, isMounting } = this.state;
    const familyTags = this.getArticleGroup(family, 'family');
    const andelaTags = this.getArticleGroup(andela, 'andela');
    const peopleTags = this.getArticleGroup(people, 'people');

    return (
      <div
        className='bg-gray-100 font-sans w-full min-h-screen m-0'
        onScroll={this.handleScroll}
        style={{ overflowY: 'scroll', maxHeight: window.innerHeight }}
      >
        <Header
          user={{ user: { ...user, isAuthenticated } }}
          profile={profile}
        />
        <NavBar />

        {loading || isMounting ? (
          <Fragment>
            <div className='container mx-auto md:flex'>
              <div className='w-full p-2 h-64 md:w-2/3 mb-2 overflow-hidden'>
                <Skeleton height='1000px' />
              </div>
              <div className='w-full md:w-1/3 p-2'>
                {this.smallArticleLoader()}
                {this.smallArticleLoader()}
              </div>
            </div>
            <div className='container mx-auto'>
              <div className='w-full p-2 md:w-2/3 mb-2 overflow-hidden hidden md:block'>
                <p>
                  <Skeleton height={40} />
                  <Skeleton width={150} />
                </p>
                <Skeleton width={50} />
              </div>
            </div>
            <div className='container mx-auto px-2'>
              <div className='flex flex-wrap justify-between'>
                <div className='w-full md:w-1/4'>
                  {this.smallArticleLoader()}
                </div>
                <div className='w-full md:w-1/4'>
                  {this.smallArticleLoader()}
                </div>
                <div className='w-full md:w-1/4'>
                  {this.smallArticleLoader()}
                </div>
              </div>
            </div>
          </Fragment>
        ) : (
          <div className='container mx-auto mt-2 p-4'>
            <h1 className='text-gray-600 mb-4 text-sm font-semibold uppercase'>
              Top Rated
            </h1>
            <div className='flex flex-col lg:flex-row max-h-lg'>
              {mostRated[0] && (
                <div className='max-w-5xl'>
                  <div className='big-article rounded overflow-hidden shadow cursor-pointer'>
                    <Carousel
                      infiniteLoop
                      useKeyboardArrows
                      interval={4000}
                      emulateTouch
                      autoPlay
                      showStatus={false}
                      showThumbs={false}
                      stopOnHover
                      transitionTime={1000}
                      onChange={this.changeBigArticle}
                      onClickItem={this.clickedArticle}
                      selectedItem={currentIndex}
                    >
                      {mostRated.map(article => {
                        const { image, title, slug } = extractArticleDetails(
                          article
                        );
                        return (
                          <img
                            src={image}
                            alt={title}
                            key={slug}
                            className='w-full big-article object-cover h-screen'
                          />
                        );
                      })}
                    </Carousel>
                  </div>
                  {currentArticle.author &&
                    this.displayBigArticle(currentArticle)}
                </div>
              )}
              <div className='md:pl-8 flex flex-col justify-between lg:pb-24 lg:mb-8'>
                <h1 className='text-gray-600 mb-4 text-sm font-semibold uppercase lg:-mt-10 lg:pt-1 mt-2 md:10'>
                  Most Recent
                </h1>
                {mostRecent.map(article =>
                  this.displaySmallArticle(article, true)
                )}
              </div>
            </div>
            <div className='w-full border bg-black mb-2 mt-2 hidden md:block' />

            {familyTags.length > 0 && (
              <h1 className='text-gray-600 my-4 text-sm font-semibold uppercase'>
                Family
              </h1>
            )}
            <div className='flex relative'>
              <div className='slider-prev-arrow'>
                <div className='slider-arrow-background-left' />
                <FontAwesome
                  type={faArrowLeft}
                  styleClass='slider-image-icon'
                  id='family-section'
                  role='presentation'
                  onClick={this.familyPrevious}
                  onKeyDown={this.familyPrevious}
                />
              </div>
              <section className='card'>
                <p ref={this.familyPreviousRef} />
                {familyTags}
                <p ref={this.familyNextRef} />
              </section>
              <div className='slider-next-arrow'>
                <div className='slider-arrow-background-right' />
                <FontAwesome
                  type={faArrowRight}
                  styleClass='slider-image-icon'
                  id='family-section'
                  role='presentation'
                  onClick={this.familyNext}
                  onKeyDown={this.familyNext}
                />
              </div>
            </div>

            {andelaTags.length > 0 && (
              <h1 className='text-gray-600 my-4 text-sm font-semibold uppercase'>
                Andela
              </h1>
            )}
            <div className='flex relative'>
              <div className='slider-prev-arrow'>
                <div className='slider-arrow-background-left' />
                <FontAwesome
                  type={faArrowLeft}
                  styleClass='slider-image-icon'
                  id='andela-section'
                  role='presentation'
                  onClick={this.andelaPrevious}
                  onKeyDown={this.andelaPrevious}
                />
              </div>
              <section className='card'>
                <p ref={this.andelaPreviousRef} />
                {andelaTags}
                <p ref={this.andelaNextRef} />
              </section>
              <div className='slider-next-arrow'>
                <div className='slider-arrow-background-right' />
                <FontAwesome
                  type={faArrowRight}
                  styleClass='slider-image-icon'
                  id='andela-section'
                  role='presentation'
                  onClick={this.andelaNext}
                  onKeyDown={this.andelaNext}
                />
              </div>
            </div>

            {peopleTags.length > 0 && (
              <h1 className='text-gray-600 my-4 text-sm font-semibold uppercase'>
                People
              </h1>
            )}
            <div className='flex relative'>
              <div className='slider-prev-arrow'>
                <div className='slider-arrow-background-left' />
                <FontAwesome
                  type={faArrowLeft}
                  styleClass='slider-image-icon'
                  id='people-section'
                  role='presentation'
                  onClick={this.peoplePrevious}
                  onKeyDown={this.peoplePrevious}
                />
              </div>
              <section className='card'>
                <p ref={this.peoplePreviousRef} />
                {peopleTags}
                <p ref={this.peopleNextRef} />
              </section>
              <div className='slider-next-arrow'>
                <div className='slider-arrow-background-right' />
                <FontAwesome
                  type={faArrowRight}
                  styleClass='slider-image-icon'
                  id='people-section'
                  role='presentation'
                  onClick={this.peopleNext}
                  onKeyDown={this.peopleNext}
                />
              </div>
            </div>

            {others.length > 0 && (
              <h1 className='text-gray-600 mt-4 text-sm font-semibold uppercase'>
                More
              </h1>
            )}
            <div className='flex flex-wrap'>
              {others.map(article => this.displaySmallArticle(article))}
            </div>
          </div>
        )}
        {next === '' && !loading && !loadingMore ? (
          <div className='justify-center text-sm italic text-gray-500 text-center mb-6'>
            <span className='sunken p-2 rounded-lg'>You are up to date</span>
          </div>
        ) : (
          ''
        )}

        {loadingMore ? (
          <Fragment>
            <div className='container mx-auto px-2'>
              <div className='flex flex-wrap justify-between'>
                <div className='w-full md:w-1/4'>
                  {this.smallArticleLoader()}
                </div>
                <div className='w-full md:w-1/4'>
                  {this.smallArticleLoader()}
                </div>
                <div className='w-full md:w-1/4'>
                  {this.smallArticleLoader()}
                </div>
              </div>
            </div>
          </Fragment>
        ) : (
          ''
        )}
      </div>
    );
  }
}

Home.propTypes = {
  user: PropTypes.shape({}).isRequired,
  profile: PropTypes.shape({}).isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  errors: PropTypes.shape({}).isRequired,
  fetchArticles: PropTypes.func.isRequired,
  articles: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  fetchMoreArticles: PropTypes.func.isRequired,
  nextPage: PropTypes.shape({ next: PropTypes.string }).isRequired,
  next: PropTypes.string,
  loadingMore: PropTypes.bool.isRequired,
  categories: PropTypes.object.isRequired
};

Home.defaultProps = {
  next: ''
};

const mapStateToProps = state => ({
  user: state.auth.user,
  profile: state.auth.profile,
  isAuthenticated: state.auth.isAuthenticated,
  errors: state.auth.errors,
  articles: state.article.articles,
  loading: state.article.loading,
  nextPage: state.article.nextPage,
  loadingMore: state.article.loadingMore,
  categories: state.article.categories
});

export default connect(
  mapStateToProps,
  { fetchArticles, fetchMoreArticles }
)(Home);
