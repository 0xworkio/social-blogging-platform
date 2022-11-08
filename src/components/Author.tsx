import { format } from 'date-fns';
import { getTimeBetween } from '../app/modules';
import React from 'react';
import type { Timestamp } from 'firebase/firestore';
import type { LazyExoticComponent } from 'react';

const Avatar: LazyExoticComponent<any> = React.lazy(() => import('./Avatar'));

interface AuthorProps {
  avatarUrl: string;
  displayName: string;
  timestamp: Timestamp;
  xs?: boolean;
  showTimeElapsed?: boolean;
}

const Author: React.FC<AuthorProps> = ({
  avatarUrl,
  displayName,
  timestamp,
  xs,
  showTimeElapsed,
}) => {
  const date = new Date(timestamp.seconds * 1000);
  return (
    <div className="flex items-center space-x-4">
      <Avatar imgLink={avatarUrl} />
      <div className={`${xs ? 'font-normal' : 'font-medium'} `}>
        <div className={xs ? 'text-sm' : ''}>{displayName}</div>
        <div className="text-sm font-light text-gray-500 ">
          Posted on {format(date, 'do MMMMMMM y')}{' '}
          {showTimeElapsed ? `(${getTimeBetween(date)})` : ''}
        </div>
      </div>
    </div>
  );
};

export default Author;
