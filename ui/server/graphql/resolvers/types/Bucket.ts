import prisma from "../../../prisma";
import {
  bucketIncome,
  bucketMaxGoal,
  bucketMinGoal,
  bucketTotalContributions,
} from "../helpers";

export const cocreators = async (bucket) => {
  return prisma.bucket.findUnique({ where: { id: bucket.id } }).cocreators();
};
export const round = async (bucket) => {
  return prisma.bucket.findUnique({ where: { id: bucket.id } }).round();
};
export const totalContributions = async (bucket) => {
  return bucketTotalContributions(bucket);
};
export const totalContributionsFromCurrentMember = async (
  bucket,
  args,
  { user }
) => {
  if (!user) return null;
  const roundMember = await prisma.roundMember.findUnique({
    where: {
      userId_roundId: {
        userId: user.id,
        roundId: bucket.roundId,
      },
    },
  });

  if (!roundMember) return 0;

  // TODO: should it be initialized at 0 like below?
  const {
    _sum: { amount = 0 },
  } = await prisma.contribution.aggregate({
    _sum: { amount: true },
    where: {
      bucketId: bucket.id,
      roundMemberId: roundMember.id,
    },
  });
  return amount;
};

export const noOfComments = async (bucket) => {
  // TODO: fix discourse check
  // Only display number of comments for non-Discourse groups
  // if (groupHasDiscourse(currentGroup)) {
  //   return;
  // }
  const comments = await prisma.bucket
    .findUnique({ where: { id: bucket.id } })
    .comments();
  return comments.length;
};
export const contributions = async (bucket) => {
  return await prisma.contribution.findMany({
    where: { bucketId: bucket.id },
    orderBy: {
      createdAt: "desc",
    },
  });
};
export const noOfContributions = async (bucket) => {
  return await prisma.contribution.count({
    where: { bucketId: bucket.id },
  });
};

export const funders = async (bucket) => {
  const funders = await prisma.contribution.groupBy({
    where: { bucketId: bucket.id },
    by: ["roundMemberId"],
    _sum: {
      amount: true,
    },
  });
  const contributionsFormat = funders.map((funder) => ({
    id: funder.roundMemberId,
    roundId: bucket.roundId,
    roundMemberId: funder.roundMemberId,
    bucketId: bucket.id,
    amount: funder._sum.amount,
    createdAt: new Date(),
  }));
  return contributionsFormat;
};

export const noOfFunders = async (bucket) => {
  const contributions = await prisma.bucket
    .findUnique({ where: { id: bucket.id } })
    .Contributions();
  // group contributions by roundMemberId
  const funders = contributions.reduce((acc, contribution) => {
    const { roundMemberId } = contribution;
    if (!acc[roundMemberId]) {
      acc[roundMemberId] = contribution;
    } else {
      acc[roundMemberId].amount += contribution.amount;
    }
    return acc;
  }, {});
  return Object.keys(funders).length;
};

export const raisedFlags = async (bucket) => {
  const resolveFlags = await prisma.flag.findMany({
    where: { bucketId: bucket.id, type: "RESOLVE_FLAG" },
    select: { resolvingFlagId: true },
  });
  const resolveFlagIds = resolveFlags.map((flag) => flag.resolvingFlagId);

  return await prisma.flag.findMany({
    where: {
      bucketId: bucket.id,
      type: "RAISE_FLAG",
      id: { notIn: resolveFlagIds },
    },
  });
};

export const flags = async (bucket) => {
  return await prisma.bucket.findUnique({ where: { id: bucket.id } }).flags();
};

export const discourseTopicUrl = async (bucket) => {
  const group = await prisma.group.findFirst({
    where: {
      rounds: { some: { buckets: { some: { id: bucket.id } } } },
    },
    include: { discourse: true },
  });
  if (!bucket.discourseTopicId || !group?.discourse?.url) return null;

  return `${group.discourse.url}/t/${bucket.discourseTopicId}`;
};

export const tags = async (bucket) => {
  // TODO: verify
  return prisma.tag.findMany({
    where: { buckets: { some: { id: bucket.id } } },
  });
};

export const images = async (bucket) =>
  prisma.bucket.findUnique({ where: { id: bucket.id } }).Images();

export const customFields = async (bucket) =>
  prisma.bucket.findUnique({ where: { id: bucket.id } }).FieldValues();

export const budgetItems = async (bucket) =>
  prisma.budgetItem.findMany({ where: { bucketId: bucket.id } });

export const published = (bucket) => !!bucket.publishedAt;
export const readyForFunding = (bucket) => !!bucket.readyForFundingAt;
export const approved = (bucket) => !!bucket.approvedAt;
export const canceled = (bucket) => !!bucket.canceledAt;
export const funded = (bucket) => !!bucket.fundedAt;
export const completed = (bucket) => !!bucket.completedAt;
export const income = async (bucket) => {
  return bucketIncome(bucket);
};
export const minGoal = async (bucket) => {
  return bucketMinGoal(bucket);
};
export const maxGoal = async (bucket) => {
  return bucketMaxGoal(bucket);
  const {
    _sum: { min },
  } = await prisma.budgetItem.aggregate({
    _sum: { min: true },
    where: {
      bucketId: bucket.id,
      type: "EXPENSE",
    },
  });

  const budgetItems = await prisma.budgetItem.findMany({
    where: { bucketId: bucket.id, type: "EXPENSE" },
  });

  const maxGoal = budgetItems.reduce(
    (acc, item) => acc + (item.max ? item.max : item.min),
    0
  );

  return maxGoal > 0 && maxGoal !== min ? maxGoal : null;
};
export const status = (bucket, args, ctx) => {
  if (bucket.completedAt) return "COMPLETED";
  if (bucket.canceledAt) return "CANCELED";
  if (bucket.fundedAt) return "FUNDED";
  if (bucket.approvedAt) return "OPEN_FOR_FUNDING";
  if (bucket.publishedAt) return "IDEA";
  return "PENDING_APPROVAL";
};
