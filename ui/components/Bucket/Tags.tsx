import { gql, useMutation } from "urql";
import Link from "next/link";
import { CloseIcon } from "components/Icons";
import AddTag from "./AddTag";
import { FormattedMessage } from "react-intl";

const REMOVE_TAG_MUTATION = gql`
  mutation RemoveTag($bucketId: ID!, $tagId: ID!) {
    removeTag(bucketId: $bucketId, tagId: $tagId) {
      id
      tags {
        id
        value
      }
    }
  }
`;

const Tags = ({ bucket, canEdit }) => {
  const [, removeTag] = useMutation(REMOVE_TAG_MUTATION);

  if (!bucket.round.tags?.length) return null;

  return (
    <div className="">
      <h2 className="mb-2 font-medium hidden md:block relative">
        <FormattedMessage defaultMessage="Tags" />
      </h2>

      <div className="flex items-center flex-wrap gap-3 mb-4">
        {bucket.tags?.map((tag) => (
          <div
            key={tag.id}
            className="py-1 px-2 bg-gray-100 rounded flex items-center"
          >
            <Link
              href={`/${bucket.round.group?.slug ?? "c"}/${
                bucket.round.slug
              }?tag=${tag.value}`}
            >
              <a className="text-gray-500 hover:text-black mr-2">{tag.value}</a>
            </Link>
            {canEdit && (
              <button
                onClick={() =>
                  removeTag({ bucketId: bucket.id, tagId: tag.id })
                }
                className="rounded-full bg-gray-400 hover:bg-black"
              >
                <CloseIcon className="w-3 h-3 text-white" />
              </button>
            )}
          </div>
        ))}
      </div>
      {canEdit && <AddTag items={bucket.round.tags} bucket={bucket} />}
    </div>
  );
};

export default Tags;
