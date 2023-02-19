import Head from "next/head";
import Sidebar from "./Sidebar";
import HappySpinner from "components/HappySpinner";
import { isMemberOfBucket } from "utils/helpers";
import Title from "./Title";
import Summary from "./Summary";
import { FormattedMessage } from "react-intl";
import { COCREATORS_CANT_EDIT } from "utils/messages";
import toast from "react-hot-toast";

export default function Overview({
  currentUser,
  currentGroup,
  fetching,
  error,
  bucket,
  openImageModal,
  showBucketReview,
}) {
  if (!bucket) return null;
  const canEdit =
    currentUser?.currentCollMember?.isAdmin ||
    currentUser?.currentCollMember?.isModerator ||
    isMemberOfBucket(currentUser, bucket);

  const cocreatorsEditableStatuses = [
    "PENDING_APPROVAL",
    "IDEA",
    "FUNDED",
    "COMPLETED",
  ];

  const isEditingAllowed =
    currentUser?.currentCollMember?.isAdmin ||
    currentUser?.currentCollMember?.isModerator ||
    (isMemberOfBucket(currentUser, bucket) &&
      (bucket.round.canCocreatorEditOpenBuckets
        ? true
        : cocreatorsEditableStatuses.indexOf(bucket.status) > -1));

  if (fetching && !bucket) {
    return (
      <div className="flex-grow flex justify-center items-center h-64">
        <HappySpinner />
      </div>
    );
  }

  if (error) {
    console.error(error);
    return (
      <div className="flex-grow flex justify-center items-center">
        {error.message}
      </div>
    );
  }

  if (!bucket) {
    return (
      <div className="flex-grow flex flex-col justify-center items-center">
        <span className="text-4xl">404</span>
        <h1 className="text-2xl">
          <FormattedMessage defaultMessage="Can't find this bucket..." />
        </h1>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {bucket.title} | {bucket.round?.title}
        </title>
      </Head>
      <div className="border-b border-b-default">
        <div className="max-w-screen-xl mx-auto py-14 px-2 md:px-4">
          <Title
            title={bucket.title}
            bucketId={bucket.id}
            canEdit={canEdit}
            isEditingAllowed={isEditingAllowed}
          />
          <Summary
            bucketId={bucket.id}
            summary={bucket.summary}
            canEdit={canEdit}
            isEditingAllowed={isEditingAllowed}
          />

          <div className="grid grid-cols-1 md:grid-cols-sidebar gap-10">
            {bucket.images.length > 0 ? (
              <img
                className="h-64 md:h-88 w-full object-cover object-center"
                src={bucket.images[0].large ?? bucket.images[0].small}
              />
            ) : canEdit ? (
              <button
                className={`w-full h-64 md:h-88 block text-gray-600 font-semibold rounded-lg border-3 border-dashed focus:outline-none focus:bg-gray-100 hover:bg-gray-100`}
                onClick={() => {
                  if (isEditingAllowed) {
                    openImageModal();
                  } else {
                    toast.error(COCREATORS_CANT_EDIT);
                  }
                }}
              >
                <FormattedMessage defaultMessage="+ Cover image" />
              </button>
            ) : (
              <div className="w-full h-64 md:h-88 block border-3 border-dashed rounded-lg"></div>
            )}
            <div className="">
              <Sidebar
                bucket={bucket}
                currentUser={currentUser}
                currentGroup={currentGroup}
                canEdit={canEdit}
                showBucketReview={showBucketReview}
                isAdminOrModerator={
                  currentUser?.currentCollMember?.isAdmin ||
                  currentUser?.currentCollMember?.isModerator
                }
                isCocreator={isMemberOfBucket(currentUser, bucket)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
