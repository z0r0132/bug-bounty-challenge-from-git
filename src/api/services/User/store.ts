import { makeAutoObservable, runInAction } from "mobx";
import type { MockOrganization } from "../../../mock/organization";
import {
  readStoredOrganization,
  writeStoredOrganization
} from "../../../mock/organization";
import {
  clearSession,
  isSessionActive,
  readSession,
  writeSession
} from "../../../mock/session";
import {
  buildUserFromSession,
  readStoredProfile,
  writeStoredProfile
} from "../../../mock/user";
import type { StoredProfile, User } from "../../../types/user";
import { resultOrError } from "../../../utils/global";

export type { User, StoredProfile };

export default class UserStore {
  user: User | null = null;
  organization: MockOrganization;
  sessionActive: boolean;
  userLoading = false;
  userLoadError: string | null = null;

  private getOwnUserInFlight = false;

  constructor() {
    this.organization = readStoredOrganization();
    this.sessionActive = isSessionActive();
    this.userLoading = false;
    makeAutoObservable(this);
  }

  /** Mock login: any non-empty email + password. Persists session only (no backend). */
  login(email: string, password: string): boolean {
    const trimmedEmail = email?.trim() ?? "";
    const trimmedPassword = password?.trim() ?? "";
    if (!trimmedEmail || !trimmedPassword) {
      return false;
    }
    writeSession({ loggedIn: true, email: trimmedEmail });
    runInAction(() => {
      this.sessionActive = true;
      this.user = buildUserFromSession(trimmedEmail);
      this.organization = readStoredOrganization();
      this.userLoadError = null;
      this.userLoading = false;
    });
    return true;
  }

  logout(): void {
    clearSession();
    runInAction(() => {
      this.user = null;
      this.sessionActive = false;
      this.userLoading = false;
      this.userLoadError = null;
    });
  }

  retryLoadUser(): void {
    runInAction(() => {
      this.userLoadError = null;
    });
    void this.getOwnUser();
  }

  updateProfile(patch: StoredProfile): void {
    const merged = { ...readStoredProfile(), ...patch };
    writeStoredProfile(merged);
    const session = readSession();
    if (session?.email) {
      runInAction(() => {
        this.user = buildUserFromSession(session.email);
      });
    }
  }

  updateOrganization(org: MockOrganization): void {
    writeStoredOrganization(org);
    runInAction(() => {
      this.organization = { ...org };
    });
  }

  async getOwnUser(): Promise<void> {
    if (this.getOwnUserInFlight) {
      return;
    }

    if (!this.sessionActive) {
      runInAction(() => {
        this.userLoading = false;
      });
      return;
    }

    const session = readSession();
    if (!session?.email) {
      runInAction(() => {
        this.userLoading = false;
        this.userLoadError = "Invalid session";
      });
      return;
    }

    this.getOwnUserInFlight = true;
    runInAction(() => {
      this.userLoading = true;
      this.userLoadError = null;
    });

    try {
      const settled = await resultOrError(
        new Promise<User>((resolve) =>
          setTimeout(() => resolve(buildUserFromSession(session.email)), 500)
        )
      );
      const [result, error] = settled as [User | null, unknown];

      if (error != null) {
        runInAction(() => {
          this.userLoadError = "Could not load profile.";
        });
        return;
      }

      if (result) {
        runInAction(() => {
          this.user = result;
          this.organization = readStoredOrganization();
        });
        return;
      }

      runInAction(() => {
        this.userLoadError = "Something went wrong.";
      });
    } finally {
      this.getOwnUserInFlight = false;
      runInAction(() => {
        this.userLoading = false;
      });
    }
  }
}
