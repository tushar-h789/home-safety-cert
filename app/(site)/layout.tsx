import Footer from "../_components/footer";
import Header from "../_components/header";
import NavBar from "../_components/nav-bar";


export default function SiteLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <Header />
      <main>{props.children}</main>
      <Footer />
    </>
  );
}
