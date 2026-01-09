import fs from "fs";
import { unique } from "vega-lite";

/**
 * Fonction pour récupérer les questions dans la banque de questions avec des critères de recherche.
 *
 * @param {string} kw Mot-clé pour la recherche
 * @param {string || string[]} id id de la question
 * @param {string} type type de la question
 */
export async function searchQuestion(kw, id, type) {
  // Vérification qu'au moins un critère de recherche est fourni
  if (!kw && !id && !type) {
    logger.error(
      "Veuillez fournir au moins un critère de recherche (mot-clé, ID, type de question)."
    );
    return;
  }

  let questionsFound = [];

  // Parcourt tous les fichiers dans le répertoire spécifié
  for (const fileName of getAllFilesFromDir("./res/SujetB_data")) {
    let data;
    try {
      data = await fs.promises.readFile(
        `./res/SujetB_data/${fileName}`,
        "utf8"
      );
    } catch (err) {
      console.error(
        `[ERREUR] Impossible d'accéder au fichier : ./res/SujetB_data/${fileName}`
      );
    }

    // Divise le contenu du fichier en questions individuelles et soustrait le premier élément vide
    const questions = data.toLowerCase().split("::").slice(1);
    for (let i = 0; i < questions.length; i += 2) {
      // Vérifie si les mot-clés sont présents dans l'ID ou le contenu de la question
      if (kw) {
        for (let keyword of kw.split(",")) {
          if (
            questions[i].includes(keyword) ||
            questions[i + 1].includes(keyword)
          ) {
            questionsFound.push({
              id: questions[i],
              content: questions[i + 1],
            });
            break;
          }
        }
      }

      if (id) {
        if (Array.isArray(id)) {
          for (let specificId of id) {
            if (questions[i].includes(specificId.toLowerCase())) {
              questionsFound.push({
                id: questions[i],
                content: questions[i + 1],
              });
            }
          }
        } else {
          if (questions[i].includes(id.toLowerCase())) {
            questionsFound.push({
              id: questions[i],
              content: questions[i + 1],
            });
          }
        }
      }

      if (type) {
        if (questions[i].includes(type.toLowerCase())) {
          questionsFound.push({
            id: questions[i],
            content: questions[i + 1],
          });
        }
      }
    }
  }
  if (questionsFound.length === 0) {
    console.log("Aucune question trouvée");
  }
  return questionsFound;
}

/**
 * Affiche un tableau de questions dans la console.
 * @param {{id: string, content: string}[]} questionsArray Tableau des questions
 * @param {boolean} showAll Indicateur pour afficher tout le contenu de la question
 */
export function displayQuestions(questionsArray, showAll) {
  const uniqueQuestions = unique(questionsArray, (d) => d.id);
  for (let question of uniqueQuestions) {
    console.log("[ID] : \n" + question.id);
    if (showAll) {
      console.log("\n[content] :\n" + question.content);
    }
  }
}

/**
 * Récupère tous les fichiers d'un répertoire donné
 *
 * @param {string} dirPath Chemin du répertoire
 * @returns Liste des fichiers dans le répertoire
 */
export function getAllFilesFromDir(dirPath) {
  return fs.readdirSync(dirPath);
}
