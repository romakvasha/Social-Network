import React from "react";
import { NavLink } from "react-router-dom";
import s from "./Users.module.css";
import usersPhoto from "../../assets/images/usersPhoto.jpg";
import { UserType } from "../../types/types";

type PropsType = {
  user: UserType
  followingInProgress: Array<number>
  canFollow: boolean
  follow: (userId: number) => void
  unfollow: (userId: number) => void
};

const User: React.FC<PropsType> = ({ user, followingInProgress, canFollow, follow, unfollow }) => {
  const inProgress = followingInProgress.some((id) => id === user.id);
  return (
    <div className={s.user}>
      <div className={s.avatarColumn}>
        <NavLink to={"/profile/" + user.id}>
          <img src={user.photos.small ?? usersPhoto} className={s.usersPhoto} alt="аватарка" />
        </NavLink>
        {canFollow &&
          (user.followed ? (
            <button disabled={inProgress} onClick={() => unfollow(user.id)}>
              Unfollow
            </button>
          ) : (
            <button disabled={inProgress} onClick={() => follow(user.id)}>
              Follow
            </button>
          ))}
      </div>
      <div>
        <NavLink to={"/profile/" + user.id} className={s.userName}>
          {user.name}
        </NavLink>
        <div className={s.userStatus}>{user.status}</div>
      </div>
    </div>
  );
};

export default User;
