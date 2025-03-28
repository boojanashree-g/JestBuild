import { sum } from "../app/home"; 

test("sum of a and b", () => {
  expect(sum(2, 2)).toBe(4);
});
