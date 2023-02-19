import { useMutation, gql } from "urql";
import { sortableElement, sortableHandle } from "react-sortable-hoc";
import { DraggableIcon } from "components/Icons";
import Tooltip from "@tippyjs/react";
import IconButton from "components/IconButton";
import { DeleteIcon, EditIcon } from "components/Icons";
import DraggableItems from "../DraggableItems";
import { FormattedMessage, useIntl } from "react-intl";

const DELETE_CUSTOM_FIELD_MUTATION = gql`
  mutation DeleteCustomField($roundId: ID!, $fieldId: ID!) {
    deleteCustomField(roundId: $roundId, fieldId: $fieldId) {
      id
      customFields {
        id
        name
        description
        type
        limit
        isRequired
        position
        createdAt
      }
    }
  }
`;

const SET_CUSTOM_FIELD_POSITION_MUTATION = gql`
  mutation SetCustomFieldPosition(
    $roundId: ID!
    $fieldId: ID!
    $newPosition: Float
  ) {
    setCustomFieldPosition(
      roundId: $roundId
      fieldId: $fieldId
      newPosition: $newPosition
    ) {
      id
      customFields {
        id
        name
        description
        type
        limit
        isRequired
        position
        createdAt
      }
    }
  }
`;

const css = {
  label:
    "bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-800 mr-2",
};

const DragHandle = sortableHandle(() => (
  <IconButton className="mx-1 cursor-move">
    <DraggableIcon className="h-6 w-6" />
  </IconButton>
));

const SortableItem = sortableElement(
  ({ item: customField, setEditingItem: setEditingCustomField, roundId }) => {
    const intl = useIntl();
    const [{ fetching: deleting }, deleteCustomField] = useMutation(
      DELETE_CUSTOM_FIELD_MUTATION
    );

    const types = {
      TEXT: intl.formatMessage({ defaultMessage: "Short Text" }),
      MULTILINE_TEXT: intl.formatMessage({ defaultMessage: "Long Text" }),
      BOOLEAN: intl.formatMessage({ defaultMessage: "Yes/No" }),
    };

    return (
      <li className="group bg-white p-4 mb-3 rounded shadow list-none">
        <div className="flex items-center justify-between">
          <h2
            className="font-semibold text-lg"
            data-testid="customfield-name-view"
          >
            {customField.name}
          </h2>
          <div>
            <Tooltip
              content={intl.formatMessage({ defaultMessage: "Edit" })}
              placement="bottom"
              arrow={false}
            >
              <IconButton
                onClick={() => setEditingCustomField(customField)}
                className="mx-1"
              >
                <EditIcon className="h-6 w-6" />
              </IconButton>
            </Tooltip>

            <Tooltip
              content={intl.formatMessage({ defaultMessage: "Delete" })}
              placement="bottom"
              arrow={false}
            >
              <IconButton
                loading={deleting}
                onClick={() =>
                  confirm(
                    intl.formatMessage(
                      {
                        defaultMessage:
                          "Deleting a custom field would delete it from all the {bucketName} that use it. Are you sure?",
                      },
                      {
                        bucketName: process.env.BUCKET_NAME_PLURAL,
                      }
                    )
                  ) && deleteCustomField({ roundId, fieldId: customField.id })
                }
              >
                <DeleteIcon className="h-6 w-6" />
              </IconButton>
            </Tooltip>

            <Tooltip
              content={intl.formatMessage({
                defaultMessage: "Drag to reorder",
              })}
              placement="bottom"
              arrow={false}
            >
              <span>
                <DragHandle />
              </span>
            </Tooltip>
          </div>
        </div>
        <p className="mb-2" data-testid="customfield-description-view">
          {customField.description}
        </p>
        <div className="flex">
          <span className={css.label} data-testid="customfield-type-view">
            <FormattedMessage defaultMessage="Type:" />{" "}
            {types[customField.type]}
          </span>
          {customField.isRequired && (
            <span className={css.label}>
              <FormattedMessage defaultMessage="Is Required" />
            </span>
          )}
        </div>
      </li>
    );
  }
);

const DraggableCustomFields = ({ round, items, setEditingItem }) => {
  const [{ fetching: loading }, setCustomFieldPosition] = useMutation(
    SET_CUSTOM_FIELD_POSITION_MUTATION
  );

  const setItemPosition = (customFieldId, newPosition) => {
    setCustomFieldPosition({
      roundId: round.id,
      fieldId: customFieldId,
      newPosition,
    });
  };

  return (
    <DraggableItems
      round={round}
      items={items}
      setItemPosition={setItemPosition}
      setPositionLoading={loading}
      SortableItem={SortableItem}
      setEditingItem={setEditingItem}
    />
  );
};

export default DraggableCustomFields;
