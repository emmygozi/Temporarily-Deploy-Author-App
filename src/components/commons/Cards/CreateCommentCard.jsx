import React from 'react';
import PropTypes from 'prop-types';
import Button from '../utilities/Button';
import Alert from './Alert';
import './Common.scss';

export function CreateCommentCard({
  name, avatar, alt, value, onSubmit, onChange, commentError, submit, reset
}) {
  return (
    <div className="">
      <div className="w-full">
        <div className="border border-gray-200 rounded bg-white p-4 flex flex-col justify-between leading-normal outline-none">
          <div className="flex items-center mb-4">
            <img className="w-10 h-10 rounded-full mr-4" src={avatar} alt={alt} />
            <div className="text-sm">
              <p className="text-gray-900 leading-none">{name.charAt(0).toUpperCase() + name.slice(1)}</p>
            </div>
          </div>
          {commentError && (<Alert alertBody={commentError} />)}
          <form className="rounded" onSubmit={onSubmit}>
            <div className="mb-2">
              <textarea autoFocus className="resize appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight" name="comment" rows="4" type="text" placeholder="What's on your mind?" value={value} onChange={onChange} />
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={submit} className="bg-transparent hover:text-white hover:bg-blue-700 border-blue-700 py-2 px-3 border rounded mr-2 text-sm">Comment</button>
              <Button type='outlined' color='red' onClick={reset}>Cancel</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

CreateCommentCard.propTypes = {
  name: PropTypes.string,
  avatar: PropTypes.string,
  alt: PropTypes.string,
  value: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  commentError: PropTypes.string
};

CreateCommentCard.defaultProps = {
  name: 'Gerrard Ezeugwa',
  avatar: 'https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png',
  alt: 'avatar',
  commentError: '',
  onSubmit: () => {}
};

export default CreateCommentCard;
