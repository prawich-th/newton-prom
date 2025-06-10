"use client";

import { createSchema } from "@/schema/authSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./createform.module.scss";
import { createUser } from "../../../actions/authActions";
import { useTransition } from "react";

export default function CreateUserForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof createSchema>>();
  const submitHandler = (values: z.infer<typeof createSchema>) => {
    console.log(values);
    const data = createSchema.safeParse(values);
    console.log(data);

    if (!data.success) {
      return console.log(data.error);
    }

    startTransition(() => {
      createUser(data.data).then((res) => {
        console.log(res);
      });
    });
  };

  return (
    <form onSubmit={form.handleSubmit(submitHandler)} className={styles.form}>
      <h3>User Information</h3>
      <div>
        <label htmlFor="">Email</label>
        <input
          {...form.register("email")}
          name="email"
          type="email"
          disabled={isPending}
        />
      </div>
      <div>
        <label htmlFor="">Name</label>
        <input
          {...form.register("name")}
          name="name"
          type="text"
          disabled={isPending}
        />
      </div>
      <div>
        <label htmlFor="">Year</label>
        <select
          {...form.register("year")}
          name="year"
          id="year"
          disabled={isPending}
        >
          <option value={13}>13</option>
          <option value={12}>12</option>
          <option value={11}>11</option>
          <option value={10}>10</option>
          <option value={14}>Other</option>
          <option value={8}>8</option>
          <option value={9}>9</option>
        </select>
      </div>
      <div>
        <label htmlFor="">Track</label>
        <select
          {...form.register("track")}
          name="track"
          id="track"
          disabled={isPending}
        >
          <option value="Medicine">Medicine & Health Science</option>
          <option value="Science">Science & Engineering</option>
          <option value="Humanities">Humanities</option>
          <option value="Business">
            Newton Business School (NBS) / Business
          </option>
          <option value="Computer">AI & Computer Science</option>
          <option value="Arts">Art & Design</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="">Room</label>
        <select
          {...form.register("room")}
          name="room"
          id="room"
          disabled={isPending}
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </div>
      <div>
        <label htmlFor="">School</label>
        <select
          {...form.register("school")}
          name="school"
          id="school"
          disabled={isPending}
        >
          <option value="Newton">Newton</option>
          <option value="OpenSchool">OpenSchool</option>
          <option value="Essense">Essense</option>
          <option value="Other-Newton">Other (Newton Group)</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <h3>Ticket Information</h3>
      <div>
        <label htmlFor="">Date of Purchase</label>
        <input
          {...form.register("t_dateofpurchase")}
          name="t_dateofpurchase"
          type="date"
          disabled={isPending}
        />
      </div>
      <div>
        <label htmlFor="">Type</label>
        <select
          {...form.register("t_type")}
          name="t_type"
          id="t_type"
          disabled={isPending}
        >
          <option value="Normal">Normal</option>
          <option value="Early Bird">Early Bird</option>
          <option value="Supervisors">Supervisors</option>
          <option value="Staff">Staff</option>
          <option value="Late">Late</option>
          <option value="Walk-in">Walk-in</option>
        </select>
      </div>
      <button type="submit">Create User</button>
    </form>
  );
}
