import fs from "fs";

describe("Program testing of search functionality", function () {
  beforeAll(function () {});

  it("should create an exam from a vcf file", async function () {
    const { createVcard } = await import("../src/vcard.js");
    await createVcard(
      "Prenom Nom",
      "prenom.nom@utt.fr",
      "UTT",
      "0123456789",
      console
    );

    let exists = false;
    await fs.promises
      .readFile("./res/vcard/Prenom_Nom.vcf", "utf8")
      .then((data) => {
        exists = data.length > 0;
      });
    expect(exists).toBe(true);
  });
});
