"use client";

import { transferSchema } from "@/schema/authSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./createform.module.scss";
import { edit } from "@/actions/registrationActions";
import { useEffect, useState, useTransition } from "react";
import StylisedButton from "@/components/stylisedBtn";
import { toast } from "react-hot-toast";
import InfoField from "@/components/infoFields";
import { User } from "@/generated/prisma";

export default function EditTicketForm({
  ticket,
  liftUser,
}: {
  ticket: User;
  liftUser: (user: User) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string[]>([]);
  const [success, setSuccess] = useState<string[]>([]);

  const form = useForm<z.infer<typeof transferSchema>>({
    defaultValues: {
      email: ticket.email,
      name: ticket.name || "",
      year: ticket.year.toString() || "13",
      track: ticket.track || "Medicine",
      room: ticket.room || "A",
      school: ticket.school || "Newton",
      id: ticket.id || "",
      mode: "edit",
    },
  });

  useEffect(() => {}, [ticket]);

  const submitHandler = (values: z.infer<typeof transferSchema>) => {
    const data = transferSchema.safeParse(values);
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
      edit(data.data, data.data.mode as "edit" | "transfer")
        .then((res) => {
          console.log(res);
          toast.dismiss(loadingToast);
          if (res.error) throw new Error(res.error);
          toast.success(res.success || "Ticket transferred successfully");
          setSuccess((success) => [
            ...success,
            res.success || "Ticket transferred successfully",
          ]);
          if (res.user?.id !== ticket.id) {
            form.setValue("id", res.user?.id || ticket.id);
          }
          liftUser(res.user as User);
        })
        .catch((err) => {
          toast.error(err.message || "Failed to transfer ticket", {
            id: loadingToast,
          });
          setError((errors) => [
            ...errors,
            err.message || "Failed to transfer ticket",
          ]);
          console.log(err);
        });
    });
  };

  return (
    <form onSubmit={form.handleSubmit(submitHandler)} className={styles.form}>
      <div className={styles.formSection}>
        <h3>New Information</h3>
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

        <div className={styles.formSection} style={{ width: "100%" }}>
          <div className={styles.formButtons}>
            <div className={styles.question}>
              <label htmlFor="">Edit Mode</label>
              <select
                {...form.register("mode")}
                name="mode"
                id="mode"
                disabled={isPending}
              >
                <option value="edit">Edit</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
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
            <StylisedButton type="submit" disabled={isPending}>
              Edit Ticket <i className="bx bx-edit"></i>
            </StylisedButton>
            <StylisedButton
              type="button"
              onClick={() => {
                form.reset();
                setError([]);
                setSuccess([]);
              }}
            >
              Old Values
            </StylisedButton>
          </div>
        </div>
      </div>
    </form>
  );
}
