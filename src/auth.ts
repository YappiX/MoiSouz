// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import axios from 'axios';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'string' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials) return;

        const user = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login_check`,
          {
            ...credentials,
          },
        );
        if (user.data.token) {
          return {
            ...user.data,
            data: {
              token: user.data.token,
              ROLES: user.data.ROLES,
              avatar: user.data.avatar,
              address: user.data.address,
              birthdate: user.data.birthdate,
              children: user.data.children,
              education: user.data.education,
              email: user.data.email,
              firstName: user.data.firstName,
              gender: user.data.gender,
              guid: user.data.guid,
              hasTradeunionOwner: user.data.hasTradeunionOwner,
              hasTradeunionMember: user.data.hasTradeunionMember,
              hasUserProfile: user.data.hasUserProfile,
              hobbies: user.data.hobbies,
              id: user.data.id,
              isActive: user.data.isActive,
              lastName: user.data.lastName,
              middleName: user.data.middleName,
              name: user.data.name,
              phone: user.data.phone,
              phoneDop: user.data.phoneDop,
              position: user.data.position,
              profession: user.data.profession,
              employerName: user.data.employerName,
              employerTitle: user.data.employerTitle,
            },
          };
        }
        return null;
      },
    }),
  ],
  session: {
    jwt: true,
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (trigger === 'update') {
        token.status = session?.status;
      }

      if (user) {
        token.accessToken = user.data.token;
        token.ROLES = user.data.ROLES;
        token.avatar = user.data.avatar;
        token.address = user.data.address;
        token.birthdate = user.data.birthdate;
        token.children = user.data.children;
        token.education = user.data.education;
        token.email = user.data.email;
        token.firstName = user.data.firstName;
        token.gender = user.data.gender;
        token.guid = user.data.guid;
        token.hasTradeunionOwner = user.data.hasTradeunionOwner;
        token.hasTradeunionMember = user.data.hasTradeunionMember;
        token.hasUserProfile = user.data.hasUserProfile;
        token.hobbies = user.data.hobbies;
        token.id = user.data.id;
        token.isActive = user.data.isActive;
        token.lastName = user.data.lastName;
        token.middleName = user.data.middleName;
        token.name = user.data.name;
        token.phone = user.data.phone;
        token.phoneDop = user.data.phoneDop;
        token.position = user.data.position;
        token.profession = user.data.profession;
        token.employerName = user.data.employerName;
        token.employerTitle = user.data.employerTitle;
      }

      return Promise.resolve(token);
    },
    session: async ({ session, token }) => {
      session.user.token = token.accessToken;
      session.user.ROLES = token.ROLES;
      session.user.avatar = token.avatar;
      session.user.address = token.address;
      session.user.birthdate = token.birthdate;
      session.user.children = token.children;
      session.user.education = token.education;
      session.user.email = token.email;
      session.user.firstName = token.firstName;
      session.user.gender = token.gender;
      session.user.guid = token.guid;
      session.user.hasTradeunionOwner = token.hasTradeunionOwner;
      session.user.hasTradeunionMember = token.hasTradeunionMember;
      session.user.hasUserProfile = token.hasUserProfile;
      session.user.hobbies = token.hobbies;
      session.user.id = token.id;
      session.user.isActive = token.isActive;
      session.user.lastName = token.lastName;
      session.user.middleName = token.middleName;
      session.user.name = token.name;
      session.user.phone = token.phone;
      session.user.phoneDop = token.phoneDop;
      session.user.position = token.position;
      session.user.profession = token.profession;
      session.user.employerName = token.employerName;
      session.user.employerTitle = token.employerTitle;

      return Promise.resolve(session);
    },
  },
});
