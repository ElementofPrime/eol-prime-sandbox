export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/journal",
    "/todo",
    "/reminders",
    "/core",
  ],
};
