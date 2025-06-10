import * as z from "zod";

export const createSchema = z.object({
  email: z.string({ message: "Invalid Email" }).email(),
  name: z.string({ message: "Invalid Name" }).min(1),
  year: z.string({ message: "Invalid Year" }),
  track: z.string({ message: "Invalid Track" }).min(1),
  room: z.string({ message: "Invalid Room" }).min(1),
  school: z.string({ message: "Invalid School" }).min(1),
  t_type: z.string({ message: "Invalid Type" }).min(1),
  t_dateofpurchase: z.string({ message: "Invalid Date of Purchase" }),
  t_checkedIn: z.boolean().default(false),
  t_disabled: z.boolean().default(false),
});

export const loginSchema = z.object({
  email: z.string({ message: "Invalid Email" }).email(),
  ticketId: z.string({ message: "Invalid Ticket ID" }).min(1),
});
