import { Link } from "react-router-dom";
import PageIntro from "../components/PageIntro";
import TelegramLink from "../components/TelegramLink";
import { brandCards, brandPage } from "../data/site";
import useTitle from "../useTitle";

export default function Brand() {
  useTitle(brandPage.title);

  return (
    <section className="page">
      <div className="wrap">
        <PageIntro eyebrow={brandPage.eyebrow} title={brandPage.title} lead={brandPage.lead} />
        <div className="card-grid">
          {brandCards.map((card) => (
            <article className="card" key={card.id}>
              <div className="card-media card-media-brand" aria-hidden="true">
                <span>{card.kicker}</span>
              </div>
              <div className="card-body">
                <h2 className="card-title">{card.title}</h2>
                <p className="card-text">{card.text}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="page-actions">
          <Link className="button" to="/catalog">
            Перейти в каталог
          </Link>
          <TelegramLink className="button button-ghost">Написать в Telegram</TelegramLink>
        </div>
      </div>
    </section>
  );
}
