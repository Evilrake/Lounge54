import useTitle from "../useTitle";
import PageIntro from "./PageIntro";
import TelegramLink from "./TelegramLink";

export default function ServiceView({ eyebrow, title, lead, sections, telegramText }) {
  useTitle(title);

  return (
    <section className="page">
      <div className="wrap">
        <PageIntro eyebrow={eyebrow} title={title} lead={lead} />
        <div className="card-grid">
          {sections.map((section) => (
            <article className="card" key={section.title}>
              <div className="card-body">
                <h2 className="card-title">{section.title}</h2>
                {section.text ? <p className="card-text">{section.text}</p> : null}
                {section.items ? (
                  <ul className="plain-list">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>
          ))}
        </div>
        <div className="page-actions">
          <TelegramLink className="button" text={telegramText}>
            Написать в Telegram
          </TelegramLink>
        </div>
      </div>
    </section>
  );
}
