import { render, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

let spy;

describe("generate objects", () => {
  it("Should render the input and button", () => {
    const { getByText, getByTestId } = render(<App />);
    expect(getByText("Please enter number of objects:")).toBeInTheDocument();
    expect(getByTestId("number-input")).toBeInTheDocument();
    expect(getByText("Generate Objects")).toBeInTheDocument();
  });

  beforeEach(() => {
    spy = jest.fn();
    global.console.log = spy;
  });

  it("Should generate objects and display them in the console", async () => {
    const { getByTestId, getByText } = render(<App />);
    const input = getByTestId("number-input");
    fireEvent.change(input, { target: { value: "3" } });
    const generateButton = getByText("Generate Objects");
    fireEvent.click(generateButton);
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: expect.stringMatching(/Obj-\d+/),
            type: expect.stringMatching(/triangle|square|circle/),
            color: expect.stringMatching(/^[0-9a-fA-F]{6}$/),
            size: expect.any(Number),
            position: expect.objectContaining({
              x: expect.any(Number),
              y: expect.any(Number),
            }),
            velocity: expect.objectContaining({
              dx: expect.any(Number),
              dy: expect.any(Number),
            }),
          }),
        ])
      );
    });
  });
});
