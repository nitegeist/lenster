import { MusicNoteIcon, PencilAltIcon, PhotographIcon, VideoCameraIcon } from '@heroicons/react/outline';
import { ChatAltIcon } from '@heroicons/react/solid';
import { t, Trans } from '@lingui/macro';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { usePublicationStore } from 'src/store/publication';
import { Card, Image, Modal, Tooltip } from 'ui';

import NewPublication from '../NewPublication';

type Action = 'update' | 'image' | 'video' | 'audio' | 'article';

interface ActionProps {
  icon: ReactNode;
  text: string;
  onClick: () => void;
}

const Action: FC<ActionProps> = ({ icon, text, onClick }) => (
  <Tooltip content={text} placement="top">
    <button
      className="lt-text-gray-500 hover:text-brand-500 flex flex-col items-center"
      onClick={onClick}
      type="button"
    >
      {icon}
    </button>
  </Tooltip>
);

const NewPost: FC = () => {
  const { query, isReady, push } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const showNewPostModal = usePublicationStore((state) => state.showNewPostModal);
  const setShowNewPostModal = usePublicationStore((state) => state.setShowNewPostModal);
  const setPublicationContent = usePublicationStore((state) => state.setPublicationContent);
  const [selectedAction, setSelectedAction] = useState<Action>('update');

  const openModal = (action: Action) => {
    setSelectedAction(action);
    setShowNewPostModal(true);
  };

  useEffect(() => {
    if (isReady && query.text) {
      const { text, url, via, hashtags } = query;
      let processedHashtags;

      if (hashtags) {
        processedHashtags = (hashtags as string)
          .split(',')
          .map((tag) => `#${tag} `)
          .join('');
      }

      const content = `${text}${processedHashtags ? ` ${processedHashtags} ` : ''}${url ? `\n\n${url}` : ''}${
        via ? `\n\nvia @${via}` : ''
      }`;

      setShowNewPostModal(true);
      setPublicationContent(content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="space-y-3 p-5">
      <div className="flex items-start space-x-3">
        <Image
          onError={({ currentTarget }) => {
            currentTarget.src = getAvatar(currentProfile, false);
          }}
          src={getAvatar(currentProfile)}
          className="h-9 w-9 cursor-pointer rounded-full border bg-gray-200 dark:border-gray-700"
          onClick={() => push(`/u/${currentProfile?.handle}`)}
          alt={formatHandle(currentProfile?.handle)}
        />
        <div className="flex w-full flex-col space-y-3">
          <button
            className="flex w-full items-center space-x-2 rounded-xl border bg-gray-100 px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
            type="button"
            onClick={() => openModal('update')}
          >
            <span>
              <Trans>What's happening?</Trans>
            </span>
          </button>
          <div className="flex items-center justify-start space-x-6 text-xs">
            <button
              className="text-brand flex flex-col items-center space-y-2"
              type="button"
              onClick={() => openModal('update')}
            >
              <ChatAltIcon className="h-5 w-5" />
              <Trans>Update</Trans>
            </button>
            <button
              className="flex flex-col items-center space-y-2"
              type="button"
              onClick={() => openModal('image')}
            >
              <PhotographIcon className="h-5 w-5" />
              <Trans>Image</Trans>
            </button>
            <button
              className="flex flex-col items-center space-y-2"
              type="button"
              onClick={() => openModal('video')}
            >
              <VideoCameraIcon className="h-5 w-5" />
              <Trans>Video</Trans>
            </button>
            <button
              className="flex flex-col items-center space-y-2"
              type="button"
              onClick={() => openModal('audio')}
            >
              <MusicNoteIcon className="h-5 w-5" />
              <Trans>Music</Trans>
            </button>
            <button
              className="flex flex-col items-center space-y-2"
              type="button"
              onClick={() => openModal('article')}
            >
              <PencilAltIcon className="h-5 w-5" />
              <Trans>Blog</Trans>
            </button>
          </div>
        </div>

        <Modal
          title={t`Create post`}
          size="md"
          show={showNewPostModal}
          onClose={() => setShowNewPostModal(false)}
        >
          {selectedAction === 'update' && <NewPublication />}
        </Modal>
      </div>
    </Card>
  );
};

export default NewPost;
