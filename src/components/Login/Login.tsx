import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { InjectedFormProps, reduxForm } from "redux-form";
import { required } from "../../utils/validators/validators";
import { createField, GetStringKeys, Input } from "../common/FormsControls/FormsControls";
import { login } from "../../redux/auth-reducer";
import { AppStateType } from "../../redux/redux-store";
import style from "../common/FormsControls/FormsControls.module.css";

type LoginFormValuesType = {
  email: string
  password: string
  rememberMe: boolean
  captcha: string
}
type LoginFormValuesTypeKeys = GetStringKeys<LoginFormValuesType>;

type LoginFormOwnProps = {
  captchaUrl: string | null
}

const LoginForm: React.FC<InjectedFormProps<LoginFormValuesType, LoginFormOwnProps> & LoginFormOwnProps> = ({
  handleSubmit,
  error,
  captchaUrl,
  submitting,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      {createField<LoginFormValuesTypeKeys>("Email", "email", [required], Input)}
      {createField<LoginFormValuesTypeKeys>("Password", "password", [required], Input, { type: "password" })}
      {createField<LoginFormValuesTypeKeys>(undefined, "rememberMe", [], Input, { type: "checkbox" }, "remember me")}

      {captchaUrl && <img src={captchaUrl} alt="captcha" />}
      {captchaUrl && createField<LoginFormValuesTypeKeys>("Symbols from image", "captcha", [required], Input)}

      {error && <div className={style.formSummaryError}>{error}</div>}
      <div>
        <button disabled={submitting}>Login</button>
      </div>
    </form>
  );
};

const LoginReduxForm = reduxForm<LoginFormValuesType, LoginFormOwnProps>({ form: "login" })(LoginForm);

const Login: React.FC = () => {
  const dispatch = useDispatch<any>();
  const captchaUrl = useSelector((state: AppStateType) => state.auth.captchaUrl);
  const isAuth = useSelector((state: AppStateType) => state.auth.isAuth);

  const onSubmit = (formData: LoginFormValuesType) => {
    return dispatch(login(formData.email, formData.password, !!formData.rememberMe, formData.captcha || null));
  };

  if (isAuth) {
    return <Redirect to="/profile" />;
  }

  return (
    <div className="page">
      <h1>Login</h1>
      <p className="hint">
        Для входу потрібен акаунт на{" "}
        <a href="https://social-network.samuraijs.com" target="_blank" rel="noreferrer">
          social-network.samuraijs.com
        </a>
      </p>
      <LoginReduxForm onSubmit={onSubmit} captchaUrl={captchaUrl} />
    </div>
  );
};

export default Login;
