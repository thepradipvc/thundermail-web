import Navbar from "@/components/Navbar";
import Background from "./_background";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Background>
      <Navbar />
      {children}
    </Background>
  );
}
