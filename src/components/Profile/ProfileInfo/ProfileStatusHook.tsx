import React, { ChangeEvent, FC, KeyboardEvent, useEffect, useState } from "react";

type PropsType = {
  status: string
  updateStatus: (newStatus: string) => void
  isOwner?: boolean
};

const ProfileStatusHook: FC<PropsType> = ({ status: propsStatus, updateStatus, isOwner = true }) => {
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState(propsStatus);

  useEffect(() => {
    setStatus(propsStatus);
  }, [propsStatus]);

  const activateEditMode = () => {
    if (isOwner) setEditMode(true);
  };
  const deactivateEditMode = () => {
    setEditMode(false);
    if (status !== propsStatus) {
      updateStatus(status);
    }
  };
  const onStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStatus(e.currentTarget.value);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") deactivateEditMode();
  };

  return (
    <div>
      {!editMode && (
        <div>
          <b>Status: </b>
          <span onDoubleClick={activateEditMode} title={isOwner ? "Двічі клацніть, щоб змінити" : undefined}>
            {propsStatus || "-------"}
          </span>
        </div>
      )}
      {editMode && (
        <div>
          <input
            onChange={onStatusChange}
            onBlur={deactivateEditMode}
            onKeyDown={onKeyDown}
            autoFocus={true}
            value={status}
            maxLength={300}
          />
        </div>
      )}
    </div>
  );
};

export default ProfileStatusHook;
