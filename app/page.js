// Make sure the path below matches the actual location of your Button component
import { UserButton } from "@clerk/nextjs";
import { Button } from "../components/ui/button"; // if you export Button as a named export

export default function Home() {
  return (
    <div>
      <h2>Hello World</h2>
      <Button>Hello World</Button>
      <UserButton
        appearance={{
          elements: {
            userButtonAvatarBox: "w-10 h-10",
            userButtonAvatar: "rounded-full",
            userButtonProfile: "hidden",
          },
        }}/>
    </div>
  );
}
