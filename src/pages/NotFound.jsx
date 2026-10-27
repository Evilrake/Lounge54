import { Link } from "react-router-dom";
import useTitle from "../useTitle";

export default function NotFound() {
  useTitle("Страница не найдена");

  return (
    <section className="page">
      <div className="wrap page-intro">
        <h1>Страница не найдена</h1>
        <p className="lead">Такого адреса на витрине нет.</p>
        <div className="page-actions">
          <Link className="button" to="/">
            На главную
          </Link>
        </div>
      </div>
    </section>
  );
}
