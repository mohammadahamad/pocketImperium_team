import { searchQuestion, displayQuestions } from "./src/search.js";
import { createExam, testExam, compareExam } from "./src/exam.js";
import { createVcard } from "./src/vcard.js";
import fs from "fs";
import caporal from "@caporal/core";
import readline from "readline";
const { program } = caporal;

/**
 * Utilitaire simple pour poser une question en CLI
 */
function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    })
  );
}

program

  /**
   * Commande readme qui permet d'afficher le contenu du fichier README.md
   */
  .command("readme", "Display the README.md file")
  .action(({ args, options, logger }) => {
    fs.readFile("./README.md", "utf8", function (err, data) {
      if (err) {
        return logger.warn(err);
      }

      logger.info(data);
    });
  })

  /**
   * Commande searchQuestion qui permet de chercher une question dans la banque de questions
   * @param {string} kw Mot-clé de recherche
   * @param {string} id ID spécifique de la question
   * @param {string} type Type spécifique de la question
   * @param {boolean} showAll Indicateur pour afficher les détails de la question
   */
  .command(
    "searchQuestion",
    "Chercher une question dans la banque de questions"
  )
  .argument("[kw]", "Mot-clé de recherche")
  .argument("[id]", "ID spécifique de la question")
  .argument("[type]", "Type spécifique de la question")
  .option("--all", "Afficher les détails de la question")
  .action(async ({ args, options }) => {
    const keywords = args.kw ? args.kw : null;
    const id = args.id ? args.id : null;
    const type = args.type ? args.type : null;
    await searchQuestion(keywords, id, type).then((results) => {
      displayQuestions(results, options.all);
    });
  })

  /**
   * Commande createExam (refactorée en mode interactif)
   */
  .command("createExam", "Créer un examen étape par étape")
.action(async ({ logger }) => {
  logger.info("=== Création d'un nouvel examen ===");

  const examName = await askQuestion("Nom de l'examen : ");
  const author = await askQuestion("Nom de l'auteur : ");

  const ids = [];
  let count = 1;

  logger.info("Saisissez les IDs des questions (laisser vide pour terminer)");

  while (true) {
    const id = await askQuestion(`ID de la question ${count} : `);
    const trimmedId = id.trim();

    // Fin de saisie
    if (!trimmedId) break;

    // 🔴 Détection doublon immédiate
    if (ids.includes(trimmedId)) {
      logger.error(`[ERREUR] L'ID "${trimmedId}" a déjà été saisi.`);
      continue;
    }

    // 🔴 Vérification existence immédiate
    const results = await searchQuestion(null, [trimmedId], null);
    if (!results || results.length === 0) {
      logger.error(
        `[ERREUR] La question avec l'ID "${trimmedId}" n'existe pas dans la banque.`
      );
      continue;
    }

    // ✅ ID valide
    ids.push(trimmedId);
    logger.info(`→ ${ids.length} question(s) validée(s)`);
    count++;
  }

  // 🔴 Validation du nombre de questions AVANT createExam
  if (ids.length < 15 || ids.length > 20) {
    logger.error(
      "Veuillez sélectionner entre 15 et 20 questions uniques et valides."
    );
    return;
  }

  // Appel logique métier
  await createExam(examName, ids, author);
})

  /**
   * Commande createVcard qui permet de créer une vCard à partir des informations d'un utilisateur
   * @param {string} completeName Nom complet de l'utilisateur
   * @param {string} email Adresse e-mail de l'utilisateur
   * @param {string} school École de l'utilisateur
   * @param {string} phone Numéro de téléphone de l'utilisateur - optionnel
   * @param {*} logger Objet logger pour afficher les messages
   */
  .command("createVcard", "Créer une vCard à partir d'un utilisateur")
  .argument("<completeName>", "Nom complet de l'utilisateur")
  .argument("<email>", "Adresse e-mail de l'utilisateur")
  .argument("<school>", "École de l'utilisateur")
  .argument("[phone]", "Numéro de téléphone de l'utilisateur")
  .action(async ({ args, logger }) => {
    await createVcard(
      args.completeName,
      args.email,
      args.school,
      args.phone,
      logger
    );
  })

  /**
   * Commande testExam qui permet de simuler un examen et obtenir une note
   * @param {string} FileName Nom du fichier de l'examen à tester
   * @param {string} FileUserAnswers Nom du fichier contenant les réponses de l'utilisateur
   * @param {*} logger Objet logger pour afficher les messages
   */
  .command("testExam", "Simuler un examen et obtenir une note")
  .argument("<examPath>", "Nom du fichier de l'examen à tester")
  .argument(
    "<fileUserAnswers>",
    "Nom du fichier contenant les réponses de l'utilisateur"
  )
  .action(async ({ args, logger }) => {
    const examPath = args.examPath;
    const userFile = args.fileUserAnswers;
    await testExam(examPath, userFile, logger);
  })

  /**
   * Commande compareExam qui permet de comparer la répartition de types de questions dans un fichier ou entre plusieurs fichiers
   * @param {string[]} Files Liste des fichiers à comparer
   * @param {*} logger Objet logger pour afficher les messages
   */
  .command(
    "compareExam",
    "Comparer la répartition de types de questions dans un fichier ou entre plusieurs fichiers"
  )
  .argument("<Files...>", "Liste des fichiers à comparer")

  .action(async ({ args, logger }) => {
    const files = args.files;
    await compareExam(files, logger);
  });

program.run(process.argv.slice(2));
