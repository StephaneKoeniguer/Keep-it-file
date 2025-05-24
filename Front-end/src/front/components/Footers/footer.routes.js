import MKTypography from "../Typography";
import logoCT from "../../assets/images/logo-ct-dark.png";

export default {
  brand: {
    name: "Keep it File",
    image: logoCT,
    route: "/",
  },
  menus: [
    {
      name: "support",
      items: [{ name: "contact", href: "/contact" }],
    },
    {
      name: "legal",
      items: [{ name: "mentions légales", href: "/legals" }],
    },
  ],
  copyright: (
    <MKTypography variant="button" fontWeight="regular">
      Copyright &copy; {new Date().getFullYear()} Keep It File
    </MKTypography>
  ),
};
