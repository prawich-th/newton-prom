"use client";

import { User } from "@/generated/prisma";
import { useForm } from "react-hook-form";
import StylisedBtn from "@/components/stylisedBtn";
import { isEligibleForRoyalty } from "@/lib/royaltyhelper";
import { useState, useTransition, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  checkin,
  removeCheckin,
  disableUser,
  enableUser,
} from "@/actions/registrationActions";

export default function UserTileActions({
  data,
  updateData,
}: {
  data: User;
  updateData: (data: User) => void;
}) {
  const form = useForm({
    defaultValues: {
      id: data.id,
    },
  });
  const [user, setUser] = useState<User>(data);
  const [isPending, startTransition] = useTransition();

  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  useEffect(() => {
    updateData(user);
  }, [user]);

  const handleCheckin = async (data: any) => {
    setActionError("");
    setActionSuccess("");

    const lToast = toast.loading("Checking in user...");

    console.log("checking in for", data);
    startTransition(async () => {
      const result = await checkin(data);
      console.log(result);
      if (result.error) {
        setActionError(result.error);
        toast.error(result.error);
      } else {
        setActionSuccess(result.success || "User checked in");
        setUser(result.user as User);
        toast.success(result.success || "User checked in");
      }
      toast.dismiss(lToast);
    });
  };
  const handleRemoveCheckin = async (data: any) => {
    setActionError("");
    setActionSuccess("");

    const lToast = toast.loading("Removing checkin...");

    console.log("removing checkin status for", data);
    startTransition(async () => {
      const result = await removeCheckin(data);
      console.log(result);
      if (result.error) {
        setActionError(result.error);
        toast.error(result.error);
      } else {
        setActionSuccess(result.success || "User checked in");
        setUser(result.user as User);
        toast.success(result.success || "User checked in");
      }
      toast.dismiss(lToast);
    });
  };

  const handleDisableUser = async (data: any) => {
    setActionError("");
    setActionSuccess("");

    const lToast = toast.loading("Disabling user...");

    console.log("disabling user for", data);

    startTransition(async () => {
      const result = await disableUser(data);
      console.log(result);
      if (result.error) {
        setActionError(result.error);
        toast.error(result.error);
      } else {
        setActionSuccess(result.success || "User disabled");
        setUser(result.user as User);
        toast.success(result.success || "User disabled");
      }
      toast.dismiss(lToast);
    });
  };

  const handleEnableUser = async (data: any) => {
    setActionError("");
    setActionSuccess("");

    const lToast = toast.loading("Enabling user...");

    console.log("enabling user for", data);
    startTransition(async () => {
      const result = await enableUser(data);
      console.log(result);
      if (result.error) {
        setActionError(result.error);
        toast.error(result.error);
      } else {
        setActionSuccess(result.success || "User enabled");
        setUser(result.user as User);
        toast.success(result.success || "User enabled");
      }
      toast.dismiss(lToast);
    });
  };

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      style={{
        display: "flex",
        gap: "0.5rem",
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <input type="text" {...form.register("id")} hidden />
      {!user.t_checkedIn ? (
        <StylisedBtn
          disabled={user.t_checkedIn || isPending}
          onClick={() => handleCheckin(user.id)}
          style={{ fontSize: "1.35rem" }}
        >
          <i className="bx bx-user-x"></i>
        </StylisedBtn>
      ) : (
        <StylisedBtn
          style={{ fontSize: "1.35rem" }}
          disabled={!user.t_checkedIn || isPending}
          onClick={() => handleRemoveCheckin(user.id)}
        >
          <i className="bx bx-user-check"></i>
        </StylisedBtn>
      )}
      {isEligibleForRoyalty(user) &&
        (!user.t_disabled ? (
          <StylisedBtn
            disabled={user.t_disabled || isPending}
            onClick={() => handleDisableUser(user.id)}
            style={{ fontSize: "1.35rem" }}
          >
            <i className="bx bx-crown"></i>
          </StylisedBtn>
        ) : (
          <StylisedBtn
            disabled={!user.t_disabled || isPending}
            onClick={() => handleEnableUser(user.id)}
            style={{ fontSize: "1.35rem" }}
          >
            <i className="bx bx-check-shield"></i>
          </StylisedBtn>
        ))}
    </form>
  );
}
