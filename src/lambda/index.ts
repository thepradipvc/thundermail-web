import { sendEmail } from "@/lib/send-email";
import { SQSBatchResponse, SQSHandler } from "aws-lambda";

export const handler: SQSHandler = async (event) => {
  const response: SQSBatchResponse = {
    batchItemFailures: [],
  };

  for (const record of event.Records) {
    const { body: emailId, messageId } = record;

    try {
      await sendEmail(emailId);
    } catch (error: any) {
      console.log(error.message);
      response.batchItemFailures.push({
        itemIdentifier: messageId,
      });
    }
  }

  return response;
};
