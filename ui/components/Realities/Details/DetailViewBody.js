import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { CardBody, CardText } from "reactstrap";
import Dependencies from "./Dependencies";
import RealizersMissingIcon from "../RealizersMissingIcon";
import Deliberations from "./Deliberations";
import Markdown from "components/Markdown";
import { FormattedMessage, useIntl } from "react-intl";

const LabelSpan = styled.span`
  font-weight: bold;
  margin-right: 0.5em;
`;

const CardSection = styled.div`
  margin-bottom: 1rem;
`;

const DetailViewBody = ({ node, isResp }) => (
  <CardBody>
    <CardText>
      <LabelSpan>
        <FormattedMessage defaultMessage="Guide:" />
      </LabelSpan>
      {node.guide &&
        (node.guide.name
          ? `${node.guide.name} (${node.guide.email})`
          : node.guide.email)}
    </CardText>

    {isResp && (
      <CardText>
        <LabelSpan>
          <FormattedMessage defaultMessage="Realizer:" />
        </LabelSpan>
        {node.realizer &&
          (node.realizer.name
            ? `${node.realizer.name} (${node.realizer.email})`
            : node.realizer.email)}
        {!node.realizer && <RealizersMissingIcon />}
      </CardText>
    )}

    <CardSection>
      <LabelSpan>
        <FormattedMessage defaultMessage="Description:" />
      </LabelSpan>
      <div>
        <Markdown source={node.description} />
      </div>
    </CardSection>

    {isResp && (
      <>
        <CardSection>
          <LabelSpan>
            <FormattedMessage defaultMessage="Related discussions:" />
          </LabelSpan>
          <Deliberations
            nodeType={node.__typename}
            nodeId={node.nodeId}
            deliberations={[...(node.deliberations || [])]}
          />
        </CardSection>

        <CardSection>
          <LabelSpan>
            <FormattedMessage defaultMessage="Depends on:" />
          </LabelSpan>
          <Dependencies
            nodeType={node.__typename}
            nodeId={node.nodeId}
            dependencies={node.dependsOnResponsibilities || []}
          />
        </CardSection>

        <CardSection>
          <LabelSpan>
            <FormattedMessage defaultMessage="What depends on this:" />
          </LabelSpan>
          <Dependencies
            nodeType={node.__typename}
            nodeId={node.nodeId}
            dependencies={node.responsibilitiesThatDependOnThis || []}
          />
        </CardSection>
      </>
    )}
  </CardBody>
);

DetailViewBody.propTypes = {
  node: PropTypes.shape({
    __typename: PropTypes.string,
    nodeId: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    guide: PropTypes.shape({
      nodeId: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    }),
    realizer: PropTypes.shape({
      nodeId: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    }),
    deliberations: PropTypes.arrayOf(
      PropTypes.shape({
        __typename: PropTypes.string,
        nodeId: PropTypes.string,
        title: PropTypes.string,
        url: PropTypes.string,
      })
    ),
    dependsOnResponsibilities: PropTypes.arrayOf(
      PropTypes.shape({
        __typename: PropTypes.string,
        nodeId: PropTypes.string,
        title: PropTypes.string,
        fulfills: PropTypes.shape({
          nodeId: PropTypes.string,
        }),
      })
    ),
    responsibilitiesThatDependOnThis: PropTypes.arrayOf(
      PropTypes.shape({
        __typename: PropTypes.string,
        nodeId: PropTypes.string,
        title: PropTypes.string,
        fulfills: PropTypes.shape({
          nodeId: PropTypes.string,
        }),
      })
    ),
  }),
  isResp: PropTypes.bool,
};

DetailViewBody.defaultProps = {
  node: {
    nodeId: "",
    title: "",
    description: "",
    guide: {
      nodeId: "",
      email: "",
      name: "",
    },
    realizer: {
      nodeId: "",
      email: "",
      name: "",
    },
    deliberations: [],
    dependsOnResponsibilities: [],
  },
  isResp: false,
};

export default DetailViewBody;
