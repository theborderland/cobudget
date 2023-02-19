import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import Button from "components/Button";
import { Edit as EditIcon } from "@material-ui/icons";
import { AddIcon } from "components/Icons";
import { FormattedMessage } from "react-intl";

const SettingsListItem = ({
  primary,
  secondary,
  isSet,
  openModal,
  disabled = false,
  canEdit,
  roundColor,
}) => {
  return (
    <ListItem>
      <ListItemText primary={primary} secondary={secondary} />
      {canEdit && (
        <ListItemSecondaryAction>
          {isSet ? (
            <IconButton onClick={openModal} disabled={disabled}>
              <EditIcon />
            </IconButton>
          ) : (
            <Button
              color={roundColor}
              size="small"
              onClick={openModal}
              disabled={disabled}
            >
              <AddIcon className="h-4 w-4 -ml-2 mr-2" />
              <FormattedMessage defaultMessage="Set" />
            </Button>
          )}
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default SettingsListItem;
