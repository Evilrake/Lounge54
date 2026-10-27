export default function PageIntro({ eyebrow, title, lead }) {
  return (
    <header className="page-intro">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1>{title}</h1>
      {lead ? <p className="lead">{lead}</p> : null}
    </header>
  );
}
