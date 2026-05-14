import React from "react";
import User from "./User";

const getAllServices = (): { StoreProvider: React.FC }[] => {
  // Example dynamic registration (webpack):
  // const ctx = require.context("./", true, /index\.tsx$/);
  // return ctx.keys().map((key) => ctx(key).StoreProvider);
  return [User];
};

export default getAllServices();
