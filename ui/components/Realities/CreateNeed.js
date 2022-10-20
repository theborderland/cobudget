import React from "react";
import { gql, useMutation } from "@apollo/client";
import * as yup from "yup";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { GET_NEEDS, CACHE_QUERY } from "lib/realities/queries";
import getRealitiesApollo from "lib/realities/getRealitiesApollo";
import ListForm from "./ListForm";
import { FormattedMessage, useIntl } from "react-intl";

const CREATE_NEED = gql`
  mutation CreateNeed_createNeedMutation($title: String!) {
    createNeed(title: $title) {
      nodeId
      title
      fulfilledBy {
        nodeId
        title
        realizer {
          nodeId
          name
        }
      }
    }
  }
`;

const CreateNeed = () => {
  const router = useRouter();
  const intl = useIntl();
  const realitiesApollo = getRealitiesApollo();

  const [createNeed] = useMutation(CREATE_NEED, {
    client: realitiesApollo,
    update: (cache, { data: { createNeed: createNeedRes } }) => {
      cache.writeQuery({
        query: CACHE_QUERY,
        data: {
          showCreateNeed: false,
        },
      });
      const { needs } = cache.readQuery({ query: GET_NEEDS });

      const alreadyExists =
        needs.filter((need) => need.nodeId === createNeedRes.nodeId).length > 0;
      if (!alreadyExists) {
        cache.writeQuery({
          query: GET_NEEDS,
          data: { needs: [createNeedRes, ...needs] },
        });
      }
    },
  });

  return (
    <Formik
      initialValues={{ title: "" }}
      validationSchema={yup.object().shape({
        title: yup
          .string()
          .required(
            intl.formatMessage({ defaultMessage: "Title is required" })
          ),
      })}
      onSubmit={(values, { resetForm }) => {
        createNeed({ variables: { title: values.title } }).then(({ data }) => {
          resetForm();
          router.push(`/realities/need/${data.createNeed.nodeId}`);
        });
      }}
    >
      {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <ListForm
          inputName="title"
          placeholder={intl.formatMessage({
            defaultMessage: "Enter a title for the new need...",
          })}
          value={values.title}
          handleChange={handleChange}
          handleBlur={handleBlur}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </Formik>
  );
};

export default CreateNeed;
