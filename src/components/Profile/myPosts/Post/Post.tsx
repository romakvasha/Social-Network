import React from "react";
import s from "./Post.module.css";
import usersPhoto from "../../../../assets/images/usersPhoto.jpg";
import { PostType } from "../../../../types/types";

type PropsType = {
  post: PostType
  photo: string | null
  onLike: () => void
  onDelete: () => void
};

const Post: React.FC<PropsType> = ({ post, photo, onLike, onDelete }) => {
  return (
    <div className={s.item}>
      <img src={photo ?? usersPhoto} alt="avatar" />
      <div className={s.body}>
        <div className={s.message}>{post.message}</div>
        <div className={s.actions}>
          <button onClick={onLike}>♥ {post.likesCount}</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default Post;
