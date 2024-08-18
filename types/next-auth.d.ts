import { DefaultSession, User as NextAuthUser } from "next-auth";

// Augment the Session interface
declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      // photo: string;
      // surname: string;
      // characteristics: CharacteristicT[];
    } & DefaultSession["user"];
  }

  // Augment the User interface
  interface User {
    _id: string;
    // photo: string;
    // surname: string;
    // characteristics: CharacteristicT[];
  }
}

// Augment the JWT interface
declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    // photo: string;
    // surname: string;
    // characteristics: CharacteristicT[];
  }
}
