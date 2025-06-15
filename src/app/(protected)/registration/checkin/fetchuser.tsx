"use client";

import {
  checkin,
  disableUser,
  enableUser,
  fetchUser,
  removeCheckin,
} from "@/actions/registrationActions";
import { isEligibleForRoyalty } from "@/lib/royaltyhelper";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import styles from "./checkin.module.scss";
import InfoField from "@/components/infoFields";
import StylisedBtn from "@/components/stylisedBtn";
import toast from "react-hot-toast";
import QrScan from "./qrscan";

export const FetchUser = () => {
  const form = useForm({
    defaultValues: {
      ticketId: "",
    },
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const [actionError, setActionError] = useState<string>("");
  const [actionSuccess, setActionSuccess] = useState<string>("");
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    if (code) {
      form.setValue("ticketId", code);
      form.handleSubmit(finduser)();
      setShowScanner(false);
    }
  }, [code]);

  const finduser = async (data: any) => {
    setError("");
    setSuccess("");
    setUser(null);
    setActionError("");
    setActionSuccess("");

    const lToast = toast.loading("Fetching user...");

    console.log(data);
    startTransition(async () => {
      const result = await fetchUser(data.ticketId);
      console.log(result);
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        setSuccess(result.success || "User checked in");
        setUser(result.user);
        toast.success(result.success || "User checked in");
      }
      toast.dismiss(lToast);
    });
  };

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
        setUser(result.user);
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
        setUser(result.user);
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
        setUser(result.user);
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
        setUser(result.user);
        toast.success(result.success || "User enabled");
      }
      toast.dismiss(lToast);
    });
  };

  return (
    <div>
      <form className={styles.form} onSubmit={form.handleSubmit(finduser)}>
        <div className={styles.info}>
          {showScanner && <QrScan setCode={setCode} />}
          <StylisedBtn onClick={() => setShowScanner((c) => !c)}>
            {showScanner ? "Hide Scanner" : "Show Scanner"}
          </StylisedBtn>
          <div>
            <input
              type="text"
              {...form.register("ticketId")}
              disabled={isPending}
            />
          </div>
          <StylisedBtn type="submit" disabled={isPending}>
            {isPending ? "Loading..." : "Find User"}
          </StylisedBtn>
        </div>
        <div className={styles.notification}>
          {error && <p style={{ color: "pink" }}>{error}</p>}
          {success && <p style={{ color: "lime" }}>{success}</p>}
        </div>
      </form>

      {user && (
        <div style={{ marginTop: "1rem" }} className={styles.user}>
          <InfoField value={`Name: ${user?.name}`} type="normal" />
          <InfoField value={`Email: ${user?.email}`} type="normal" />
          <InfoField
            value={`Class: Year ${user?.year} ${user?.track}`}
            type="normal"
          />
          <InfoField
            value={`Checked In: ${user?.t_checkedIn ? "Yes" : "No"}`}
            type={user?.t_checkedIn ? "success" : "error"}
          />
          {user?.t_checkedInAt && (
            <InfoField
              value={`Checked In At: ${user?.t_checkedInAt.toLocaleString(
                "en-GB",
                {
                  hour12: false,
                }
              )}`}
              type="normal"
            />
          )}
          {isEligibleForRoyalty(user) ? (
            <>
              <InfoField value={`Eligible for Royalty`} type="success" />
              <InfoField
                value={`${
                  user?.t_disabled
                    ? "Cannot be voted for (Disabled)"
                    : "Can be voted for"
                }`}
                type={user?.t_disabled ? "error" : "success"}
              />
            </>
          ) : (
            <InfoField value={`Not eligible for Royalty`} type="error" />
          )}

          <InfoField value={`Ticket ID: ${user?.id}`} type="normal" />
          <InfoField
            value={`Created At: ${user?.createdAt.toLocaleString("en-GB")}`}
            type="normal"
          />
          {user.last_agent && (
            <InfoField value={`Last Agent: ${user.last_agent}`} />
          )}
          <div className={styles.actions}>
            {!user.t_checkedIn ? (
              <StylisedBtn
                disabled={user.t_checkedIn || isPending}
                onClick={() => handleCheckin(user.id)}
              >
                Checkin
              </StylisedBtn>
            ) : (
              <StylisedBtn
                disabled={!user.t_checkedIn || isPending}
                onClick={() => handleRemoveCheckin(user.id)}
              >
                Remove Checkin Status
              </StylisedBtn>
            )}
            {isEligibleForRoyalty(user) &&
              (!user.t_disabled ? (
                <StylisedBtn
                  disabled={user.t_disabled || isPending}
                  onClick={() => handleDisableUser(user.id)}
                >
                  Disable Prom Royalty
                </StylisedBtn>
              ) : (
                <StylisedBtn
                  disabled={!user.t_disabled || isPending}
                  onClick={() => handleEnableUser(user.id)}
                >
                  Enable Prom Royalty
                </StylisedBtn>
              ))}
          </div>
          <div className={styles.actionsNotification}>
            {actionError && <InfoField value={actionError} type="error" />}
            {actionSuccess && (
              <InfoField value={actionSuccess} type="success" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
