import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useParams } from "react-router-dom";
import Profile from "./Profile";
import { getStatus, getUserProfile } from "../../redux/profile-reducer";
import { AppStateType } from "../../redux/redux-store";

const ProfileContainer: React.FC = () => {
  const params = useParams<{ userId?: string }>();
  const authorizedUserId = useSelector((state: AppStateType) => state.auth.userId);
  const dispatch = useDispatch<any>();

  const userId = params.userId ? Number(params.userId) : authorizedUserId;

  useEffect(() => {
    if (userId) {
      dispatch(getUserProfile(userId));
      dispatch(getStatus(userId));
    }
  }, [userId, dispatch]);

  if (!userId) {
    return <Redirect to="/login" />;
  }

  const isOwner = !params.userId || Number(params.userId) === authorizedUserId;
  return <Profile isOwner={isOwner} />;
};

export default ProfileContainer;
