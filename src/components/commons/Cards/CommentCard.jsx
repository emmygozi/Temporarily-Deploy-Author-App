import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { faTrashAlt } from '@fortawesome/fontawesome-free-regular';
import { faHeart } from '@fortawesome/fontawesome-free-solid';
import FontAwesome from '../utilities/FontAwesome';

export function CommentCard({
  name, avatar, alt, body, createdAt, del, like, likes, userLike }) {
  return (
    <div className="px-auto my-4 p-1 bg-gray-200">
      <div className="w-full">
        <div className="border-r border-b border-l border-gray-400 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
          <div className="flex mb-4">
            <img className="w-10 h-10 rounded-full mr-4" src={avatar || "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"} alt={alt} />
            <div className="text-sm">
              <p className="text-gray-900 leading-none">{name}</p>
              <p className="text-gray-600 mt-1">{createdAt}</p>
            </div>
            <div className="text-bg ml-auto">
              <span className="mr-1">{likes}</span>
              <FontAwesome
                type={faHeart}
                onClick={like}
                styleClass={
                  classnames('cursor-pointer', {
                    'liked': userLike,
                    'faHeart': !userLike
                  })
                }
              />
            </div>
          </div>
          <div className="mb-4 ml-8">
            <p className="text-gray-700 text-base">{body}</p>
          </div>
          <div className="text-bg ml-auto">
            <FontAwesome type={faTrashAlt} onClick={del} onKeyDown={del} styleClass="cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}

CommentCard.propTypes = {
  name: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
  like: PropTypes.func.isRequired,
  avatar: PropTypes.string.isRequired,
  alt: PropTypes.string,
  createdAt: PropTypes.string.isRequired,
  del: PropTypes.func.isRequired
};

CommentCard.defaultProps = {
  alt: 'avatar',
};

export default CommentCard;
