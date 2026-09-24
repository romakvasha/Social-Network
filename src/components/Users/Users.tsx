import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import Paginator from "../common/Paginator/Paginator";
import User from "./User";
import UsersSearchForm from "./UsersSearchForm";
import { follow, requestUsers, unfollow } from "../../redux/users-reducer";
import { UsersFilterType } from "../../api/api";
import {
  getCurrentPage,
  getFollowingInProgress,
  getPageSize,
  getTotalUsersCount,
  getUsers,
  getUsersFilter,
} from "../../redux/users-selectors";
import { AppStateType } from "../../redux/redux-store";

const parseFriend = (value: string | null): null | boolean => {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
};

const Users: React.FC = () => {
  const users = useSelector(getUsers);
  const totalUsersCount = useSelector(getTotalUsersCount);
  const currentPage = useSelector(getCurrentPage);
  const pageSize = useSelector(getPageSize);
  const filter = useSelector(getUsersFilter);
  const followingInProgress = useSelector(getFollowingInProgress);
  const isAuth = useSelector((state: AppStateType) => state.auth.isAuth);

  const dispatch = useDispatch<any>();
  const history = useHistory();
  const location = useLocation();

  // Перше завантаження: беремо сторінку і фільтр з URL, якщо вони там є
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = Number(params.get("page")) || currentPage;
    const actualFilter: UsersFilterType = {
      term: params.get("term") ?? filter.term,
      friend: params.has("friend") ? parseFriend(params.get("friend")) : filter.friend,
    };
    dispatch(requestUsers(page, pageSize, actualFilter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Синхронізуємо URL зі станом, щоб посилання можна було скопіювати
  useEffect(() => {
    const params = new URLSearchParams();
    if (filter.term) params.set("term", filter.term);
    if (filter.friend !== null) params.set("friend", String(filter.friend));
    if (currentPage !== 1) params.set("page", String(currentPage));
    const search = params.toString();
    if (search !== location.search.replace(/^\?/, "")) {
      history.replace({ pathname: location.pathname, search });
    }
  }, [filter, currentPage, history, location.pathname, location.search]);

  const onPageChanged = (pageNumber: number) => {
    dispatch(requestUsers(pageNumber, pageSize, filter));
  };
  const onFilterChanged = (newFilter: UsersFilterType) => {
    dispatch(requestUsers(1, pageSize, newFilter));
  };

  return (
    <div>
      <UsersSearchForm filter={filter} onFilterChanged={onFilterChanged} canFilterFriends={isAuth} />
      <Paginator
        totalItemsCount={totalUsersCount}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChanged={onPageChanged}
      />
      <div>
        {users.map((u) => (
          <User
            key={u.id}
            user={u}
            followingInProgress={followingInProgress}
            canFollow={isAuth}
            follow={(userId) => dispatch(follow(userId))}
            unfollow={(userId) => dispatch(unfollow(userId))}
          />
        ))}
        {users.length === 0 && <p>Нікого не знайдено</p>}
      </div>
    </div>
  );
};

export default Users;
