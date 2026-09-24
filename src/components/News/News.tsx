import React from "react";

const news = [
  { id: 1, title: "Соціальна мережа запущена", text: "Тепер можна шукати друзів, писати пости та спілкуватися в чаті." },
  { id: 2, title: "Новий загальний чат", text: "Спілкуйтеся з усіма користувачами мережі в реальному часі." },
  { id: 3, title: "Пошук користувачів", text: "Шукайте людей за іменем і фільтруйте лише друзів." },
];

const News: React.FC = () => {
  return (
    <div className="page">
      <h2>News</h2>
      {news.map((n) => (
        <article key={n.id} className="card">
          <h3>{n.title}</h3>
          <p>{n.text}</p>
        </article>
      ))}
    </div>
  );
};

export default News;
