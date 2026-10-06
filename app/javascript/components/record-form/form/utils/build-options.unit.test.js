import buildOptions from "./build-options";

describe("buildOptions", () => {
  describe("when the field is the service implementing agency individual", () => {
    const name = "services_section[0].service_implementing_agency_individual";

    it("should return the current user as a disabled option when the referral users were not loaded", () => {
      const options = buildOptions(name, "User", "hpierce", [], "hpierce");

      expect(options).toEqual([{ id: "hpierce", display_text: "hpierce", disabled: true }]);
    });

    it("should append the current user as a disabled option when it is not in the referral users", () => {
      const users = [{ id: "user-1", display_text: "user-1" }];
      const options = buildOptions(name, "User", "hpierce", users, "hpierce");

      expect(options).toEqual([...users, { id: "hpierce", display_text: "hpierce", disabled: true }]);
    });

    it("should not append the current user when the filters changed", () => {
      const options = buildOptions(name, "User", "hpierce", [], "hpierce", { filtersChanged: true });

      expect(options).toEqual([]);
    });
  });
});
