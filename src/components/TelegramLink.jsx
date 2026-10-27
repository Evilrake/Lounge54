import { telegramHref } from "../data/site";

export default function TelegramLink({ text, className, children, ...props }) {
  return (
    <a
      {...props}
      className={className}
      href={telegramHref(text)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
