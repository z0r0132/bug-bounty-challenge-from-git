import {
  buildUserFromSession,
  DEFAULT_MOCK_USER,
  readStoredProfile,
  writeStoredProfile
} from "./user";

describe("mock user", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("uses session email when profile has no email", () => {
    const user = buildUserFromSession("demo@test.com");
    expect(user.eMail).toBe("demo@test.com");
    expect(user.firstName).toBe(DEFAULT_MOCK_USER.firstName);
  });

  it("merges stored profile over defaults", () => {
    writeStoredProfile({ firstName: "Custom", lastName: "Name" });
    const user = buildUserFromSession("other@test.com");
    expect(user.firstName).toBe("Custom");
    expect(user.lastName).toBe("Name");
    expect(user.eMail).toBe("other@test.com");
  });

  it("prefers profile email when set", () => {
    writeStoredProfile({ eMail: "profile@test.com" });
    expect(buildUserFromSession("session@test.com").eMail).toBe(
      "profile@test.com"
    );
    expect(readStoredProfile().eMail).toBe("profile@test.com");
  });
});
