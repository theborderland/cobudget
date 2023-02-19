import { useState } from "react";
import { useQuery, useMutation, gql } from "urql";
import Avatar from "../Avatar";
import { AddIcon, DeleteIcon } from "../Icons";
import { Modal } from "@material-ui/core";
import { useIntl, FormattedMessage } from "react-intl";

const SEARCH_MEMBERS_QUERY = gql`
  query SearchMembers($roundId: ID!, $isApproved: Boolean!) {
    members(roundId: $roundId, isApproved: $isApproved) {
      id
      isApproved
      hasJoined
      user {
        id
        username
        avatar
      }
    }
  }
`;

const ADD_CO_CREATOR_MUTATION = gql`
  mutation AddCocreator($bucketId: ID!, $memberId: ID!) {
    addCocreator(bucketId: $bucketId, memberId: $memberId) {
      id
      cocreators {
        id
        user {
          id
          username
          avatar
        }
      }
    }
  }
`;

const REMOVE_CO_CREATOR_MUTATION = gql`
  mutation RemoveCocreator($bucketId: ID!, $memberId: ID!) {
    removeCocreator(bucketId: $bucketId, memberId: $memberId) {
      id
      cocreators {
        id
        user {
          id
          username
          avatar
        }
      }
    }
  }
`;

const Member = ({
  member,
  add,
  remove,
}: {
  member: any;
  add?: () => void;
  remove?: () => void;
}) => {
  return (
    <div className="flex items-center justify-between mb-2 overflow-y-scroll ">
      <div className="flex items-center">
        <Avatar user={member.user} size="small" />
        <span className="ml-2 text-gray-800">{member.user.username}</span>
      </div>
      <div className="flex items-center">
        {Boolean(add) && (
          <button
            onClick={add}
            className="rounded-full p-1 hover:bg-gray-200 focus:outline-none focus:ring text-gray-800"
          >
            <AddIcon className="w-6 h-6" />
          </button>
        )}
        {Boolean(remove) && (
          <button
            onClick={remove}
            className="rounded-full p-1 hover:bg-gray-200 focus:outline-none focus:ring text-gray-800"
          >
            <DeleteIcon className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

const SearchMembersResult = ({
  searchInput,
  cocreators,
  roundId,
  addCocreator,
  bucket,
}) => {
  const [{ data: { members } = { members: [] } }] = useQuery({
    query: SEARCH_MEMBERS_QUERY,
    variables: { roundId, isApproved: true },
  });

  const cocreatorIds = cocreators.map((cocreator) => cocreator.id);

  // remove already added co-creators
  let result = members.filter(
    (member) => !cocreatorIds.includes(member.id) && member.hasJoined
  );

  if (searchInput) {
    result = result.filter((member) =>
      member.user.username?.toLowerCase().includes(searchInput.toLowerCase())
    );
  }

  return (
    <div>
      {result.map((member) => (
        <Member
          key={member.id}
          member={member}
          add={() =>
            addCocreator({
              bucketId: bucket.id,
              memberId: member.id,
            }).catch((err) => alert(err.message))
          }
        />
      ))}
    </div>
  );
};

const EditCocreatorsModal = ({
  open,
  handleClose,
  bucket,
  cocreators,
  currentUser,
}) => {
  const intl = useIntl();
  const [searchInput, setSearchInput] = useState("");

  const [, addCocreator] = useMutation(ADD_CO_CREATOR_MUTATION);
  const [, removeCocreator] = useMutation(REMOVE_CO_CREATOR_MUTATION);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className="flex items-start justify-center p-4 md:pt-16 overflow-y-scroll max-h-screen"
    >
      <div className="bg-white rounded shadow p-6 grid grid-cols-2 gap-4 focus:outline-none">
        <div className="border-r pr-4">
          <h2 className="font-medium mb-2">
            <FormattedMessage defaultMessage="Co-creators" />
          </h2>
          {cocreators.map((member) => (
            <Member
              key={member.id}
              member={member}
              remove={() => {
                if (
                  member.id !== currentUser?.currentCollMember.id ||
                  confirm(
                    intl.formatMessage({
                      defaultMessage:
                        "Are you sure you would like to remove yourself? This can't be undone (unless you are admin/guide)",
                    })
                  )
                ) {
                  removeCocreator({
                    bucketId: bucket.id,
                    memberId: member.id,
                  }).catch((err) => alert(err.message));
                }
              }}
            />
          ))}
        </div>
        <div>
          <h2 className="font-medium mb-2">
            <FormattedMessage defaultMessage="Add co-creator" />
          </h2>
          <div>
            <input
              value={searchInput}
              placeholder={intl.formatMessage({
                defaultMessage: "Filter by name...",
              })}
              className="bg-gray-200 rounded py-2 px-3 mb-4 focus:outline-none focus:ring focus:bg-white"
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <SearchMembersResult
              searchInput={searchInput}
              addCocreator={addCocreator}
              cocreators={cocreators}
              roundId={bucket.round.id}
              bucket={bucket}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditCocreatorsModal;
