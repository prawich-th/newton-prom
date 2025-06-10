"use client";

import { loginSchema } from "@/schema/authSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./loginform.module.scss";
import { LoginUser, logOut } from "../../../actions/authActions";
import { useTransition } from "react";
import { redirect } from "next/navigation";
import StylisedBtn from "@/components/stylisedBtn";
import toast from "react-hot-toast";

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
        if (res?.error) {
          toast.error(res.error);
        }
        // if (!res?.error) return redirect("/");
      });
    });
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(submitHandler)} className={styles.form}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...form.register("email")}
            disabled={isPending}
          />
        </div>
        <div>
          <label htmlFor="ticketId">Ticket ID</label>
          <input
            type="text"
            id="ticketId"
            {...form.register("ticketId")}
            disabled={isPending}
          />
        </div>
        <StylisedBtn type="submit" disabled={isPending}>
          {isPending ? "Loading..." : "Login"}
        </StylisedBtn>
      </form>
    </>
  );
}
