import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../app/page"; // Adjust this import path as needed

// Utility function for rendering the Home component
const renderComponent = () => render(<Home />);

describe("Home Component", () => {
  beforeEach(() => {
    renderComponent(); // Automatically render before each test
  });

  test("renders the heading", () => {
    expect(screen.getByText(/Our Features/i)).toBeInTheDocument();
  });

  test("renders all feature titles", () => {
    const features = [
      "AI Course Builder",
      "Video Generate AI",
      "Live Event",
      "AI Knowledge Center",
      "Quizzes",
      "Build Scenario",
      "AI Podcast",
      "MetaMAZE"
    ];

    features.forEach((feature) => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

});
