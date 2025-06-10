"use client";

import { createSchema } from "@/schema/authSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./createform.module.scss";
import { createUser } from "../../../../actions/authActions";
import { useState, useTransition } from "react";
import StylisedButton from "@/components/stylisedBtn";
import { toast } from "react-hot-toast";
import InfoField from "@/components/infoFields";

export default function CreateUserForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string[]>([]);
  const [success, setSuccess] = useState<string[]>([]);
  const form = useForm<z.infer<typeof createSchema>>({
    defaultValues: {
      email: "",
      name: "",
      year: "13",
      track: "Medicine",
      room: "A",
      school: "Newton",
      t_type: "Normal",
      t_dateofpurchase: "",
    },
  });

  const submitHandler = (values: z.infer<typeof createSchema>) => {
    const data = createSchema.safeParse(values);
    setError([]);
    setSuccess([]);

    if (!data.success) {
      data.error.issues.forEach((issue) => {
        setError((errors) => [...errors, issue.message]);
      });

      return;
    }

    startTransition(() => {
      const loadingToast = toast.loading("Creating user...");
      createUser(data.data)
        .then((res) => {
          console.log(res);
          toast.dismiss(loadingToast);
          if (res.error) throw new Error(res.error);
          toast.success(res.success || "User created successfully");
          setSuccess((success) => [
            ...success,
            res.success || "User created successfully",
          ]);
          form.reset();
        })
        .catch((err) => {
          toast.error(err.message || "Failed to create user", {
            id: loadingToast,
          });
          setError((errors) => [
            ...errors,
            err.message || "Failed to create user",
          ]);
          console.log(err);
        });
    });
  };

  return (
    <form onSubmit={form.handleSubmit(submitHandler)} className={styles.form}>
      <div className={styles.formSection}>
        <h3>User Information</h3>
        <div className={styles.question}>
          <label htmlFor="">Email</label>
          <input
            {...form.register("email")}
            name="email"
            type="email"
            disabled={isPending}
          />
        </div>
        <div className={styles.question}>
          <label htmlFor="">Name</label>
          <input
            {...form.register("name")}
            name="name"
            type="text"
            disabled={isPending}
          />
        </div>
        <div className={styles.question}>
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
        <div className={styles.question}>
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
        <div className={styles.question}>
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
        <div className={styles.question}>
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
      </div>
      <div className={styles.formSection}>
        <h3>Ticket Information</h3>
        <div className={styles.question}>
          <label htmlFor="">Date of Purchase</label>
          <input
            {...form.register("t_dateofpurchase")}
            name="t_dateofpurchase"
            type="date"
            disabled={isPending}
          />
        </div>
        <div className={styles.question}>
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
      </div>
      <div className={styles.formButtons}>
        <div className={styles.notifications}>
          {error.length > 0 && (
            <>
              {error.map((err) => (
                <InfoField value={err} type="error" fullWidth key={err} />
              ))}
            </>
          )}
          {success.length > 0 && (
            <>
              {success.map((suc) => (
                <InfoField value={suc} type="success" fullWidth key={suc} />
              ))}
            </>
          )}
        </div>
        <StylisedButton type="submit">Create User</StylisedButton>
        <StylisedButton
          type="button"
          onClick={() => {
            form.reset();
            setError([]);
            setSuccess([]);
          }}
        >
          Reset
        </StylisedButton>
      </div>
    </form>
  );
}
