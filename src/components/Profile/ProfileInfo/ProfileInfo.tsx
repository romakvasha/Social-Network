import React, { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Preloader from "../../common/preloader/Preloader";
import s from "./ProfileInfo.module.css";
import ProfileStatusHook from "./ProfileStatusHook";
import ProfileDataForm from "./ProfileDataForm";
import usersPhoto from "../../../assets/images/usersPhoto.jpg";
import { savePhoto, saveProfile, updateStatus } from "../../../redux/profile-reducer";
import { AppStateType } from "../../../redux/redux-store";
import { ContactsType, ProfileType } from "../../../types/types";

type PropsType = {
  isOwner: boolean
};

const ProfileInfo: React.FC<PropsType> = ({ isOwner }) => {
  const profile = useSelector((state: AppStateType) => state.profilePage.profile);
  const status = useSelector((state: AppStateType) => state.profilePage.status);
  const dispatch = useDispatch<any>();
  const [editMode, setEditMode] = useState(false);

  if (!profile) {
    return <Preloader />;
  }

  const onMainPhotoSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      dispatch(savePhoto(e.target.files[0]));
    }
  };

  const onSubmit = async (formData: ProfileType) => {
    try {
      await dispatch(saveProfile({ ...formData, userId: profile.userId }));
      setEditMode(false);
    } catch {
      // помилку вже показано у формі через stopSubmit
    }
  };

  return (
    <div className={s.descriptionBlock}>
      <div className={s.photoBlock}>
        <img src={profile.photos.large || usersPhoto} alt="ava" className={s.mainPhoto} />
        {isOwner && (
          <label className={s.uploadLabel}>
            Змінити фото
            <input type="file" accept="image/*" onChange={onMainPhotoSelected} hidden />
          </label>
        )}
      </div>

      <div className={s.info}>
        <ProfileStatusHook
          status={status}
          updateStatus={(newStatus) => dispatch(updateStatus(newStatus))}
          isOwner={isOwner}
        />
        {editMode ? (
          <ProfileDataForm initialValues={profile} profile={profile} onSubmit={onSubmit} />
        ) : (
          <ProfileData goToEditMode={() => setEditMode(true)} profile={profile} isOwner={isOwner} />
        )}
      </div>
    </div>
  );
};

type ProfileDataPropsType = {
  profile: ProfileType
  isOwner: boolean
  goToEditMode: () => void
};

const ProfileData: React.FC<ProfileDataPropsType> = ({ profile, isOwner, goToEditMode }) => {
  return (
    <div>
      <h2>{profile.fullName}</h2>
      <div>
        <b>Looking for a job</b>: {profile.lookingForAJob ? "yes" : "no"}
      </div>
      {profile.lookingForAJob && (
        <div>
          <b>My professional skills</b>: {profile.lookingForAJobDescription}
        </div>
      )}
      <div>
        <b>About me</b>: {profile.aboutMe}
      </div>
      <div>
        <b>Contacts</b>:
        {(Object.keys(profile.contacts) as Array<keyof ContactsType>)
          .filter((key) => profile.contacts[key])
          .map((key) => (
            <Contact key={key} contactTitle={key} contactValue={profile.contacts[key]} />
          ))}
      </div>
      {isOwner && (
        <div className={s.editButton}>
          <button onClick={goToEditMode}>Edit profile</button>
        </div>
      )}
    </div>
  );
};

type ContactPropsType = {
  contactTitle: string
  contactValue: string
};

const Contact: React.FC<ContactPropsType> = ({ contactTitle, contactValue }) => {
  const href = /^https?:\/\//.test(contactValue) ? contactValue : `https://${contactValue}`;
  return (
    <div className={s.contact}>
      <b>{contactTitle}</b>:{" "}
      <a href={href} target="_blank" rel="noreferrer">
        {contactValue}
      </a>
    </div>
  );
};

export default ProfileInfo;
