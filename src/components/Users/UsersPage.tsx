import React from "react";
import { useSelector } from "react-redux";
import Preloader from "../common/preloader/Preloader";
import { getIsFetching } from "../../redux/users-selectors";
import Users from "./Users";

type PropsType = {
  pageTitle: string
};

const UsersPage: React.FC<PropsType> = ({ pageTitle }) => {
  const isFetching = useSelector(getIsFetching);
  return (
    <div className="page">
      <h2>{pageTitle}</h2>
      {isFetching && <Preloader />}
      <Users />
    </div>
  );
};

export default UsersPage;
