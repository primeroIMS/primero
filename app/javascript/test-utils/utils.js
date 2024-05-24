import { waitFor } from "@testing-library/react";

// eslint-disable-next-line import/prefer-default-export
export async function expectNever(callable) {
  await expect(() => waitFor(callable)).rejects.toEqual(expect.anything());
}
