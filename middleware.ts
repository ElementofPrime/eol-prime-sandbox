export { default } from "next-auth/middleware";

// Protect routes here (adjust to your app)
export const config = {
  matcher: ["/dashboard/:path*", "/journal/:path*", "/tasks/:path*"],
};
