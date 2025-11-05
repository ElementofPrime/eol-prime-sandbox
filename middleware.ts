export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/journal", "/ToDo", "/reminders", "/core"],
};
