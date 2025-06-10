"use client";

import { loginSchema } from "@/schema/authSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./loginform.module.scss";
import { LoginUser, logOut } from "../../../actions/authActions";
import { useTransition } from "react";

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof loginSchema>>();

  const submitHandler = (values: z.infer<typeof loginSchema>) => {
    console.log(values);
    const data = loginSchema.safeParse(values);
    console.log(data);

    if (!data.success) {
      return console.log(data.error);
    }

    startTransition(() => {
      LoginUser(data.data).then((res) => {
        console.log(res);
      });
    });
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(submitHandler)} className={styles.form}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" {...form.register("email")} />
        </div>
        <div>
          <label htmlFor="ticketId">Ticket ID</label>
          <input type="text" id="ticketId" {...form.register("ticketId")} />
        </div>
        <button type="submit">Login</button>
      </form>
      <button onClick={() => logOut()}>Sign Out</button>
    </>
  );
}
