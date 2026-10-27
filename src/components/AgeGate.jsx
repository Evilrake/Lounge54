import { useEffect, useState } from "react";

const STORAGE_KEY = "lounge54-age";

export default function AgeGate() {
  const [choice, setChoice] = useState(() => localStorage.getItem(STORAGE_KEY));

  useEffect(() => {
    if (choice === "yes") return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [choice]);

  if (choice === "yes") return null;

  function choose(next) {
    localStorage.setItem(STORAGE_KEY, next);
    setChoice(next);
  }

  return (
    <div className="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-title">
      <div className="age-card">
        <p className="eyebrow">18+</p>
        <h2 id="age-title">Вам уже есть 18 лет?</h2>
        <p className="card-text">
          Lounge54 показывает кальяны и комплектующие. Витрина открыта для посетителей старше 18 лет.
        </p>
        {choice === "no" ? (
          <p className="card-text">Посмотреть витрину можно с 18 лет. Если возраст указан по ошибке, подтвердите его ниже.</p>
        ) : null}
        <div className="age-actions">
          <button className="button" type="button" onClick={() => choose("yes")} autoFocus>
            Да, мне есть 18 лет
          </button>
          <button className="button button-ghost" type="button" onClick={() => choose("no")}>
            Мне меньше 18
          </button>
        </div>
      </div>
    </div>
  );
}
