import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import Button from './Button';
import { showAlert } from './Alert';
import { updateDoc, doc, arrayUnion, db } from '../app/firebase';
import type { RootState } from '../app/store';
import type { DocumentReference, DocumentData } from 'firebase/firestore';

interface CommentsProps {
  post: null | undefined | DocumentData;
  postID: string;
}

const Comments: React.FC<CommentsProps> = ({ post, postID }) => {
  const [value, setValue] = useState('');
  const [commentList, setCommentList] = useState(post?.comments);
  const user: RootState['user'] = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const addComment: Function = async (
    text: string,
    uid: string,
    displayName: string,
    photoUrl: string
  ): Promise<void> => {
    const postRef: DocumentReference<DocumentData> = doc(db, 'posts', postID);
    const commentObject = { author: { uid, displayName, photoUrl }, text };
    await updateDoc(postRef, {
      comments: arrayUnion(commentObject),
    });
    setValue('');
    const newCommentList = [...commentList, commentObject];
    setCommentList(newCommentList);
  };

  const handleCommentSubmit: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ): void => {
    e.preventDefault();
    if (value.length >= 6 && user.data) {
      addComment(
        value,
        user.data.uid,
        user.data.displayName,
        user.data.photoUrl
      );
    } else if (!user.data) {
      showAlert(
        'Error!',
        'You need to be logged in in order to add comments!',
        'info',
        dispatch
      );
    } else {
      showAlert(
        'Error!',
        'Your comment needs at least 6 characters!',
        'danger',
        dispatch
      );
    }
  };

  const handleTextareaChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    e
  ): void => {
    setValue(e.target.value);
  };

  return (
    <div>
      <label
        htmlFor="comment"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
      >
        Add new comment:
      </label>
      <textarea
        value={value}
        onChange={handleTextareaChange}
        id="comment"
        rows={6}
        className="resize-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Your comment..."
      ></textarea>
      <div className="w-full flex justify-end mt-4">
        <Button
          text="Add comment"
          variant="primary"
          handleClick={handleCommentSubmit}
        />
      </div>
    </div>
  );
};

export default Comments;