import { z } from "zod";
import { Request, Response } from "express";

const validateRequestBody = (
  schema: z.ZodSchema,
  req: Request,
  res: Response
) => {
  const validation = schema.safeParse(req.body);

  if (!validation.success) {
    const errorDetails = validation.error.issues.map((issue) => ({
      field: String(issue.path[0]),
      message: issue.message,
    }));

    res.status(400).json({
      success: false,
      message: "Validation error occurred",
      errorDetails,
    });

    return false;
  }

  return true;
};

export default validateRequestBody;
