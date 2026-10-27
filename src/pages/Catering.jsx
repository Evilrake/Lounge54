import ServiceView from "../components/ServiceView";
import { catering } from "../data/site";

export default function Catering() {
  return <ServiceView {...catering} />;
}
