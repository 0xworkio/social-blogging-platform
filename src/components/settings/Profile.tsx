import React, { useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  db,
  doc,
  updateDoc,
  uploadBytesResumable,
  getDownloadURL,
  storage,
  ref,
} from '../../app/firebase';
import { login } from '../../features/user/userSlice';
import { showAlert } from '../Alert';
import type { RootState } from '../../app/store';
import type { LazyExoticComponent } from 'react';
import type { DocumentReference, DocumentData } from 'firebase/firestore';

const Card: LazyExoticComponent<any> = React.lazy(() => import('../Card'));
const Button: LazyExoticComponent<any> = React.lazy(() => import('../Button'));
const Avatar: LazyExoticComponent<any> = React.lazy(() => import('../Avatar'));
const Alert: LazyExoticComponent<any> = React.lazy(() => import('../Alert'));
const Spinner: LazyExoticComponent<any> = React.lazy(
  () => import('../Spinner')
);

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = ({}) => {
  const user: RootState['user'] = useAppSelector((state) => state.user);
  const alert: RootState['alert'] = useAppSelector((state) => state.alert);
  const dispatch = useAppDispatch();
  const [nameValue, setNameValue] = useState('');
  const [displayNameValue, setDisplayNameValue] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user.data) {
      setNameValue(user.data.name);
      setDisplayNameValue(user.data.displayName);
    }
  }, [user]);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ): void => {
    if (e.target.id === 'name') {
      setNameValue(e.target.value);
    }
    if (e.target.id === 'display-name') {
      setDisplayNameValue(e.target.value);
    }
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ): void => {
    var file;
    if (fileInput.current !== null) {
      const input = fileInput.current;
      if (input.files) {
        file = input.files[0];
      }
    }
    if (file && file.size > 1097152) {
      showAlert(
        'Error!',
        'The file you are trying to upload is too big! (Maximum accepted size is 1MB)',
        'danger',
        dispatch
      );
      e.target.value = '';
    }
  };

  const requestUserDataChange = async (newData: object): Promise<any> => {
    if (user.data) {
      const ref: DocumentReference<DocumentData> = doc(
        db,
        'users',
        user.data.uid
      );
      const newUserData = {
        ...user.data,
        ...newData,
      };
      await updateDoc(ref, { ...newData });
      dispatch(login(newUserData));
    }
  };

  const requestPostsDataChange = async (): Promise<any> => {
    if (user.data) {
      const posts = user.data.posts;
      posts.forEach(async (post) => {
        const ref: DocumentReference<DocumentData> = doc(db, 'posts', post);
        await updateDoc(ref, {
          'author.displayName': displayNameValue,
          'author.photoUrl': profileUrl ? profileUrl : user.data?.photoUrl,
        });
      });
    }
  };

  const requestFileUpload = async (file: File): Promise<any> => {
    const storageRef = ref(storage, `profilepics/${user.data?.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setIsUploading(true);
    uploadTask.on(
      'state_changed',
      (snapshot) => {},
      (error) => {
        console.error('File upload failed!');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          requestUserDataChange({ photoUrl: downloadURL });
          setProfileUrl(downloadURL);
          setIsUploading(false);
        });
      }
    );
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    e
  ): Promise<any> => {
    e.preventDefault();
    if (!nameValue || !displayNameValue) {
      showAlert(
        'Error!',
        'Some of the required inputs are empty. Please fill them up.',
        'danger',
        dispatch
      );
      return;
    }
    var file;
    if (fileInput.current !== null) {
      const input = fileInput.current;
      if (input.files) {
        file = input.files[0];
      }
    }
    if (file) await requestFileUpload(file);
    requestUserDataChange({ name: nameValue, displayName: displayNameValue });
    if (user.data && user.data.posts.length > 0) requestPostsDataChange();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="mx-4 mt-8 mb-4 text-center text-2xl font-bold text-gray-900">
        Profile settings
      </h1>
      <Card customClasses="p-4 my-6">
        {alert.data.isShown && (
          <Alert title={alert.data.title} variant={alert.data.variant}>
            {alert.data.text}
          </Alert>
        )}
        <h2 className="mb-4 text-xl font-bold text-gray-900">User</h2>
        <div className="flex flex-col gap-2 my-2">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Name: *
          </label>
          <input
            onChange={handleInputChange}
            value={nameValue}
            id="name"
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
          />
        </div>
        <div className="flex flex-col gap-2 my-2">
          <label
            htmlFor="display-name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Display Name: *
          </label>
          <input
            onChange={handleInputChange}
            value={displayNameValue}
            id="display-name"
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
          />
        </div>
        <div className="flex flex-col gap-2 my-2">
          <label
            htmlFor="profile-pic"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Profile Picture:
          </label>
          <div className="flex gap-4 items-center">
            <Avatar imgLink={user.data?.photoUrl} />
            <input
              onChange={handleFileChange}
              id="profile-pic"
              type="file"
              accept="image/png, image/jpeg"
              ref={fileInput}
            />
          </div>
        </div>{' '}
        <div className="ml-auto w-fit">
          {isUploading ? (
            <Spinner />
          ) : (
            <Button type="submit" text="Submit changes" variant="primary" />
          )}
        </div>
      </Card>
    </form>
  );
};

export default Profile;
