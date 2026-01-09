describe("Program testing of exams interactions", function () {
  beforeAll(function () {});

  it("should test an exam and return a score", async function () {
    const { testExam } = await import("../src/exam.js");
    this.examPath = "./res/SujetB_data/EM-U4-p32_33-Review.gift";
    this.userAnswersFile = "answer[EM-U4-p32_33-Review].txt";
    const score = await testExam(this.examPath, this.userAnswersFile, console);
    expect(score).toEqual(9);
  });
});
