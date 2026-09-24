import React, { FormEvent, useEffect, useState } from "react";
import { UsersFilterType } from "../../api/api";
import s from "./Users.module.css";

type FriendFormType = "null" | "true" | "false";

type PropsType = {
  filter: UsersFilterType
  onFilterChanged: (filter: UsersFilterType) => void
  canFilterFriends: boolean
};

const UsersSearchForm: React.FC<PropsType> = React.memo(({ filter, onFilterChanged, canFilterFriends }) => {
  const [term, setTerm] = useState(filter.term);
  const [friend, setFriend] = useState<FriendFormType>(String(filter.friend) as FriendFormType);

  useEffect(() => {
    setTerm(filter.term);
    setFriend(String(filter.friend) as FriendFormType);
  }, [filter]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    onFilterChanged({
      term: term.trim(),
      friend: friend === "null" ? null : friend === "true",
    });
  };

  return (
    <form className={s.searchForm} onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Пошук за іменем"
        value={term}
        onChange={(e) => setTerm(e.currentTarget.value)}
      />
      {canFilterFriends && (
        <select value={friend} onChange={(e) => setFriend(e.currentTarget.value as FriendFormType)}>
          <option value="null">Усі</option>
          <option value="true">Лише друзі</option>
          <option value="false">Не друзі</option>
        </select>
      )}
      <button type="submit">Знайти</button>
    </form>
  );
});

export default UsersSearchForm;
