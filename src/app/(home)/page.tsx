import { validateUser } from "@/auth/validateUser";

const Home = async () => {
  const { user } = await validateUser();

  return (
    <main className="flex h-full flex-col items-center p-24">
      <h1 className="text-5xl font-medium">Welcom to GmailIt</h1>
      <p>launching soon</p>
    </main>
  );
};

export default Home;
