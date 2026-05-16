import type { User } from "../../types/user";

export const getInitials = (user: User): string => {
  if (user.firstName || user.lastName) {
    return [user.firstName, user.lastName]
      .map((n) => (n?.[0] ? n[0].toLocaleUpperCase() : ""))
      .join("");
  }
  return "";
};

export const stringAvatar = (user: User) => {
  const initials = getInitials(user);
  const r = Math.floor(parseInt(initials[0] ? initials[0] : "k", 36) * 7);
  const g = Math.floor(parseInt(initials[1] ? initials[1] : "l", 36) * 7);
  const b = Math.floor(
    parseInt(user?.firstName?.[1] ? user.firstName[1] : "m", 36) * 7
  );
  return {
    sx: { bgcolor: `rgb(${r},${g},${b})`, cursor: "pointer" },
    children: initials
  };
};
