"use client";

import { User } from "@/generated/prisma";
import styles from "./userTile.module.scss";
import InfoField from "@/components/infoFields";
import { interpretTrack } from "@/lib/interpretTrack";
import UserTileActions from "./useTileActions";
import { useEffect, useState } from "react";
import { isEligibleForRoyalty } from "@/lib/royaltyhelper";
import Tile from "../tile/tile";

export default function UserTile({
  user,
  actions = true,
}: {
  user: User;
  actions?: boolean;
}) {
  const [data, setData] = useState<User>(user);

  useEffect(() => {
    setData(user);
  }, [user]);

  const updateData = (data: User) => {
    setData(data);
  };

  return (
    <Tile>
      <h3>{data.name}</h3>
      <InfoField value={`Year: ${data.year}`} fullWidth />
      <InfoField value={`Track: ${interpretTrack(data.track)}`} fullWidth />
      <InfoField value={data.t_type} fullWidth />
      <InfoField
        fullWidth
        value={
          data.t_checkedIn
            ? `Checked In at ${data.t_checkedInAt?.toLocaleString("en-GB")}`
            : "Not Checked In"
        }
        type={data.t_checkedIn ? "success" : "error"}
      />
      {isEligibleForRoyalty(data) ? (
        <InfoField
          fullWidth
          value={
            data.t_disabled ? "Disabled From Royalty" : "Enabled For Royalty"
          }
          type={data.t_disabled ? "error" : "success"}
        />
      ) : (
        <InfoField
          fullWidth
          value={"Not Eligible for Prom Royalty"}
          type="normal"
        />
      )}
      <InfoField value={data.id} fullWidth />
      <InfoField value={data.email} fullWidth />
      {actions && <UserTileActions data={data} updateData={updateData} />}
    </Tile>
  );
}
