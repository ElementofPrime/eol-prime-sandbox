export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/journal", "/To-Do", "/reminders", "/core"],
};
