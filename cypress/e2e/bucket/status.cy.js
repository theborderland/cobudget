import login from "../../utils/login";
import get from "../../utils/get";
import { createBucket } from "../../utils/bucket";
import { createRound } from "../../utils/round";

describe("Update bucket status", () => {
  beforeEach(login);

  const now = Date.now();
  const roundSlug = `round${now}`;

  before(() => {
    login();
    createRound(roundSlug);
  });

  it("updates bucket status", () => {
    createBucket(roundSlug, `Bucket ${now}`);

    get("publish-bucket").click();

    get("open-for-funding-button").click();

    cy.reload();

    get("bucket-status-view").contains("Funding");

    get("accept-funding-button").click();

    cy.on("window:confirm", (text) => {
      expect(text).to.satisfy((text) => {
        const confirmMsgs = [
          "Are you sure you would like to accept and finalize funding for this bucket? This can't be undone.",
          "Are you sure you would like to mark this bucket as completed? This can't be undone.",
        ];
        return confirmMsgs.indexOf(text) > -1;
      });

      return true;
    });

    cy.reload();

    // Since we haven't added any budget for this bucket,
    // it's status should be funded.
    get("bucket-status-view").contains("Funded");

    get("mark-as-completed-button").click();

    cy.reload();

    get("bucket-status-view").contains("Completed");
  });
});
