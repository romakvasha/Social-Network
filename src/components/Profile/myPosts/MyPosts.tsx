import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { InjectedFormProps, reduxForm, reset } from "redux-form";
import s from "./MyPosts.module.css";
import Post from "./Post/Post";
import { maxLengthCreator, required } from "../../../utils/validators/validators";
import { createField, Textarea } from "../../common/FormsControls/FormsControls";
import { actions } from "../../../redux/profile-reducer";
import { AppStateType } from "../../../redux/redux-store";

type AddPostFormValuesType = {
  newPostBody: string
};

const maxLength300 = maxLengthCreator(300);

const AddPostForm: React.FC<InjectedFormProps<AddPostFormValuesType>> = ({ handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      {createField<keyof AddPostFormValuesType>("Post message", "newPostBody", [required, maxLength300], Textarea)}
      <div>
        <button>Add post</button>
      </div>
    </form>
  );
};

const AddPostFormRedux = reduxForm<AddPostFormValuesType>({ form: "addPostForm" })(AddPostForm);

const MyPosts: React.FC = React.memo(() => {
  const posts = useSelector((state: AppStateType) => state.profilePage.postData);
  const photo = useSelector((state: AppStateType) => state.profilePage.profile?.photos.small ?? null);
  const dispatch = useDispatch();

  const addNewPost = (values: AddPostFormValuesType) => {
    dispatch(actions.addPost(values.newPostBody));
    dispatch(reset("addPostForm"));
  };

  return (
    <div className={s.postsBlog}>
      <h3>My posts</h3>
      <AddPostFormRedux onSubmit={addNewPost} />
      <div className={s.posts}>
        {[...posts].reverse().map((p) => (
          <Post
            key={p.id}
            post={p}
            photo={photo}
            onLike={() => dispatch(actions.likePost(p.id))}
            onDelete={() => dispatch(actions.deletePost(p.id))}
          />
        ))}
      </div>
    </div>
  );
});

export default MyPosts;
