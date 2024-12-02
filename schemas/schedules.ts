import { z } from "zod";

export const scheduleSchema = z.object({
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Provide a valid start time",
  })
});
