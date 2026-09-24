import React from "react";
import MyPosts from "./myPosts/MyPosts";
import ProfileInfo from "./ProfileInfo/ProfileInfo";

type PropsType = {
  isOwner: boolean
};

const Profile: React.FC<PropsType> = ({ isOwner }) => {
  return (
    <div className="page">
      <ProfileInfo isOwner={isOwner} />
      {isOwner && <MyPosts />}
    </div>
  );
};

export default Profile;
