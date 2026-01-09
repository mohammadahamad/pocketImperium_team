import fs from "fs";

describe("Program testing of search functionality", function () {
  beforeAll(function () {});

  it("should read the exam file content", async function () {
    this.examPath = "./res/SujetB_data/U1-p7-Adverbs.gift";

    await fs.promises.readFile(this.examPath, "utf8").then((data) => {
      this.examContent = data;
    });

    expect(this.examContent).toBeDefined();
    expect(this.examContent.length).toBeGreaterThan(0);
  });

  it("should search for a question by keyword", async function () {
    const { searchQuestion } = await import("../src/search.js");
    const results = await searchQuestion("adverb", null, null);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id || results[0].content).toContain("adverb");
  });

  it("should search for a question by id", async function () {
    const { searchQuestion } = await import("../src/search.js");
    const results = await searchQuestion(null, "U1 p7 Adverbs GR 1.1", null);
    expect(results[0].id).toContain("u1 p7 adverbs gr 1.1");
  });

  it("should search for a question by type", async function () {
    const { searchQuestion } = await import("../src/search.js");
    const results = await searchQuestion(null, null, "Reading");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toContain("reading");
  });
});
