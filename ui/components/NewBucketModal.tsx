import { useForm } from "react-hook-form";

import { useMutation, gql } from "urql";
import Router from "next/router";

import { Modal } from "@material-ui/core";

import TextField from "components/TextField";
import Button from "components/Button";
import toast from "react-hot-toast";
import { FormattedMessage, useIntl } from "react-intl";
import { MAX_BUCKET_TITLE_LENGTH } from "../constants";

const CREATE_BUCKET = gql`
  mutation CreateBucket($roundId: ID!, $title: String!) {
    createBucket(roundId: $roundId, title: $title) {
      id
      title
      round {
        id
        slug
      }
    }
  }
`;

const NewBucketModal = ({ round, handleClose, router }) => {
  const intl = useIntl();
  const [{ fetching: loading }, createBucket] = useMutation(CREATE_BUCKET);

  const { handleSubmit, register, errors } = useForm();

  const onSubmitCreate = (variables) => {
    createBucket({ ...variables, roundId: round.id }).then(
      ({ data, error }) => {
        if (error) {
          toast.error(error.message);
        } else {
          console.log({ data });
          Router.push(
            "/[group]/[round]/[bucket]",
            `/${router.query.group}/${round.slug}/${data.createBucket.id}`
          );
          handleClose();
        }
      }
    );
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      className="flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-lg shadow p-6 focus:outline-none flex-1 max-w-screen-sm">
        <form onSubmit={handleSubmit(onSubmitCreate)}>
          <h1 className="text-xl font-semibold">
            <FormattedMessage
              defaultMessage="New {bucketName}"
              values={{
                bucketName: process.env.BUCKET_NAME_SINGULAR,
              }}
            />
          </h1>

          <TextField
            className="my-3"
            name="title"
            size="large"
            placeholder={intl.formatMessage({ defaultMessage: "Title" })}
            inputRef={register({
              required: "Required",
            })}
            inputProps={{
              maxLength: MAX_BUCKET_TITLE_LENGTH,
            }}
            autoFocus
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
            color={round.color}
            testid="new-bucket-title-input"
          />

          <div className="flex justify-end">
            <Button
              size="large"
              variant="secondary"
              onClick={handleClose}
              className="mr-3"
              color={round.color}
            >
              <FormattedMessage defaultMessage="Cancel" />
            </Button>
            <Button
              size="large"
              type="submit"
              loading={loading}
              color={round.color}
            >
              <FormattedMessage defaultMessage="Create" />
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default NewBucketModal;
